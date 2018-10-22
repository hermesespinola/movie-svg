import bezier from 'adaptive-bezier-curve'
import abs from 'abs-svg-path'
import normalize from 'normalize-svg-path'
import cleanPSLG from 'clean-pslg'
import cdt2d from 'cdt2d'
import { randomFloat, findBounds, pointTo3D, normalizePathScale } from './lib/utils'
import simplify from 'simplify-path'

export const defaultOpts = {
    delaunay: true,
    clean: true,
    exterior: false,
    normalize: true,
    randomization: 0,
    scale: 1,
    simplify: 0,
}

const bezierTo = (points, scale, start, seg) => {
    const [x, y, z] = [
        [seg[1], seg[2]],
        [seg[3], seg[4]],
        [seg[5], seg[6]],
    ]
    bezier(start, x, y, z, scale, points)
}

const svgContours = (path, scale) => {
    const paths = []
    let points = []
    let pen = [0, 0]
    normalize(abs(path)).forEach(segment => {
        if (segment[0] === 'M') {
            [pen[0], pen[1]] = segment
            if (points.length > 0) {
                paths.push(points)
                points = []
            }
        } else if (segment[0] === 'C') {
            bezierTo(points, scale, pen, segment)
            pen = [segment[5], segment[6]]
        } else {
            throw new Error(`illegal type in SVG: ${segment[0]}`)
        }
    })
    if (points.length > 0) {
        paths.push(points)
    }
    return paths
}

const polyline = (paths) => {
    const positions = []
    const edges = []

    paths.forEach(path => {
        const hull = []
        path.forEach(pos => {
            let idx = positions.indexOf(pos)
            // remove duplicate points
            if (idx === -1) {
                positions.push(pos)
                idx = positions.length - 1
            }
            hull.push(idx)
        })
        edges.push(hull)
    })
    return { positions, edges }
}

const createMesh = (path, opts = defaultOpts) => {
    let contours = svgContours(path, opts.scale)
    if (opts.simplify > 0) {
        contours = contours.map(contour => simplify(contour, opts.scale))
    }

    // before triangulation
    let { positions, edges: loops } = polyline(contours)
    const bounds = (opts.normalize || opts.randomization > 0) ? findBounds(positions) : null

    // Add random points
    if (opts.randomization > 0) {
        const [[minX, minY], [maxX, maxY]] = bounds
        for (let i = 0; i < opts.randomization; i++) {
            positions.push([randomFloat(minX, maxX), randomFloat(minY, maxY)])
        }
    }

    const edges = []
    loops.forEach(loop => {
        for (let i = 0; i < loop.length; ++i) {
            edges.push([loop[i], loop[(i + 1) % loop.length]])
        }
    })

    // maybe clean planar straight-line graph
    if (opts.clean) {
        cleanPSLG(positions, edges)
    }

    // triangulate mesh
    const cells = cdt2d(positions, edges, opts)

    // rescale to [-1, 1]
    if (opts.normalize) {
        normalizePathScale(positions, bounds)
    }

    // convert to 3D points
    positions = positions.map(pointTo3D)
    return { positions, cells }
}

export default createMesh
