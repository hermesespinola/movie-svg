import fragmentShader from './shaders/idle_frag.glsl'
import vertexShader from './shaders/idle_vert.glsl'
import { centroid, randomFloat } from '../lib/utils'
import { vec3 } from 'gl-matrix'
import SceneObject from '../SceneObject';

/**
 * Create animation attributes for the icon
 * @param {object} mesh
 */
const animationAttributes = ({ positions, cells }) => {
    const directions = []
    const centroids = []
    cells.forEach(([i1, i2, i3]) => {
        const triangle = [positions[i1], positions[i2], positions[i3]]
        const center = vec3.fromValues(...centroid(triangle))
        centroids.push(center, center, center)
        const rand = vec3.fromValues(randomFloat(), randomFloat(), randomFloat())
        directions.push(rand, rand, rand)
    })
    return {
        // direction: {
        //     type: 'vec3',
        //     value: directions,
        // },
        centroid: {
            type: 'vec3',
            value: centroids,
        },
    }
}

class Icon extends SceneObject {
    constructor(mesh, color = [1., 1., 1.]) {
        const attributes = animationAttributes(mesh)
        const mat = {
            type: SceneObject.type.TRIANGLES,
            color,
            attributes,
            uniforms: {
                pointSize: {
                    type: 'float',
                    value: 2.0,
                },
                triangleScale: {
                    type: 'float',
                    value: 1.0,
                }
            },
        }

        super(vertexShader, fragmentShader, mesh.positions, mat)
    }
}

export default Icon
