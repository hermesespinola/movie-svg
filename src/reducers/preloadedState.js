export default {
    animations: [],
    initialAnimationState: {
        color: [1, 1, 1],
        translation: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
        uniforms: {
            triangleScale: {
                type: 'float',
                value: 1.0,
            },
            pointSize: {
                type: 'float',
                value: 1.0,
            },
        },
    },
    animationName: 'New Animation',
    shaderAnimations: [],
    shaderName: 'idle',
    drawMethod: 'TRIANGLES',
}
