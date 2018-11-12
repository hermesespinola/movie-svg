import vertexShader from './shaders/idle_vert.glsl'
import fragmentShader from './shaders/idle_frag.glsl'
import { centroid } from '../lib/utils'
import { vec3 } from 'gl-matrix'

export default {
    animationAttributes({ positions, cells }) {
        const centroids = []
        cells.forEach(([i1, i2, i3]) => {
            const triangle = [positions[i1], positions[i2], positions[i3]]
            const center = vec3.fromValues(...centroid(triangle))
            centroids.push(center, center, center)
        })
        return {
            centroid: {
                type: 'vec3',
                value: centroids,
            },
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
        }
    },
    fragmentShader,
    vertexShader,
}
