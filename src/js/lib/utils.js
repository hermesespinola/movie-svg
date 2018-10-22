/**
 * Get random float value from *min* to *max*. Default range is [0, 1]
 * @param {number} max max value for random number
 * @param {number} min min value for random number
 */
export const randomFloat = (min = 0, max = 1) => Math.random() * (max - min) + min

export const findBounds = (points) => {
    if (!points.length) {
        return []
    }

    // Make a copy of points
    const lower = points[0].slice()
    const higher = points[0].slice()

    points.forEach(point => {
        point.forEach((val, i) => {
            lower[i] = Math.min(lower[i], val)
            higher[i] = Math.max(higher[i], val)
        })
    })
    return [lower, higher]
}

/**
 * Adds a z component with 0 value
 * @param {number[]} point 2D point
 */
export const pointTo3D = ([x, y, z = 0]) => [x, y * -1, z]

export const unlerp = (min, max, val) => (val - min) / (max - min)
export const normalizePathScale = (positions, bounds) => {
    const [[minX, minY], [maxX, maxY]] = bounds

    const width = maxX - minX
    const height = maxY - minY

    const aspectX = width > height ? 1 : (height / width)
    const aspectY = width > height ? (width / height) : 1

    if (maxX - minX === 0 || maxY - minY === 0) {
        return positions
    }

    return positions.map(pos => [
        (unlerp(minX, maxX, pos[0]) * 2 - 1) / aspectX,
        (unlerp(minY, maxY, pos[1]) * 2 - 1) / aspectY,
    ])
}

/**
 * Find triangle centroid
 * @param {number[]} triangle triangle vertices
 * @returns {number[]} triangle centroid
 */
export const centroid = ([p1, p2, p3]) => p1.map((t0, i) => {
    const t1 = p2[i]
    const t2 = p3[i]
    return (t0 + t1 + t2) / 3
})

/**
 * @see https://github.com/hughsk/unindex-mesh
 * @param {number[]} positions
 * @param {number[]} cells
 * @param {number[]} out
 */
export const unindex = ({ positions, cells }, out) => {
    if (positions.positions && positions.cells) {
        out = cells
        cells = positions.cells
        positions = positions.positions
    }

    var dims = positions.length ? positions[0].length : 0
    var points = cells.length ? cells[0].length : 0

    out = out || new Float32Array(cells.length * points * dims)

    if (points === 3 && dims === 2) {
        for (var i = 0, n = 0, l = cells.length; i < l; i += 1) {
        var cell = cells[i]
        out[n++] = positions[cell[0]][0]
        out[n++] = positions[cell[0]][1]
        out[n++] = positions[cell[1]][0]
        out[n++] = positions[cell[1]][1]
        out[n++] = positions[cell[2]][0]
        out[n++] = positions[cell[2]][1]
        }
    } else
    if (points === 3 && dims === 3) {
        for (var i = 0, n = 0, l = cells.length; i < l; i += 1) {
        var cell = cells[i]
        out[n++] = positions[cell[0]][0]
        out[n++] = positions[cell[0]][1]
        out[n++] = positions[cell[0]][2]
        out[n++] = positions[cell[1]][0]
        out[n++] = positions[cell[1]][1]
        out[n++] = positions[cell[1]][2]
        out[n++] = positions[cell[2]][0]
        out[n++] = positions[cell[2]][1]
        out[n++] = positions[cell[2]][2]
        }
    } else {
        for (var i = 0, n = 0, l = cells.length; i < l; i += 1) {
        var cell = cells[i]
        for (var c = 0; c < cell.length; c++) {
            var C = cell[c]
            for (var k = 0; k < dims; k++) {
            out[n++] = positions[C][k]
            }
        }
        }
    }

    return out
}

/**
 * @see https://github.com/hughsk/mesh-reindex
 * @param {number[]} array 
 */
export const reindex = (array) => {
    const positions = []
    const cells = []

    let i = 0
    let c = 0
    while (i < array.length) {
        cells.push([c++, c++, c++])
        positions.push([
            array[i++],
            array[i++],
            array[i++]
        ], [
            array[i++],
            array[i++],
            array[i++]
        ], [
            array[i++],
            array[i++],
            array[i++]
        ])
}

return { positions, cells }
}


export const flatten = (array, innerLength) => {
    const flattened = new Float32Array(array.length * innerLength)
    array.forEach((inner, i) => {
        const idx = i * innerLength
        for (let j = 0; j < innerLength; j++) {
            flattened[idx + j] = inner[j]
        }
    })
    return flattened
}