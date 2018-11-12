import vertexShader from './shaders/anim_vert.glsl'
import fragmentShader from './shaders/idle_frag.glsl'
import { centroid, randomFloat } from '../lib/utils'
import { vec3 } from 'gl-matrix'

export default {
    animationAttributes({ positions, cells }) {
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
            centroid: {
                type: 'vec3',
                value: centroids,
            },
            direction: {
                type: 'vec3',
                value: directions,
            }
        }
    },
    uniforms: {
        triangleScale: {
            type: 'float',
            value: 1.0,
        },
        pointSize: {
            type: 'float',
            value: 1.0,
        },
        animate: {
            type: 'float',
            value: 1.0,
        },
    },
    fragmentShader,
    vertexShader,
}
