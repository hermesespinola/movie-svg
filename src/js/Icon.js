import SceneObject from './SceneObject';

class Icon extends SceneObject {
    constructor(mesh, animationShader) {
        const { animationAttributes, uniforms, vertexShader, fragmentShader } = animationShader;
        const attributes = animationAttributes(mesh)
        const mat = {
            type: SceneObject.type.TRIANGLES,
            color: [1.0, 1.0, 1.0],
            attributes,
            uniforms,
        }

        super(vertexShader, fragmentShader, mesh, mat)
    }
}

export default Icon
