import SceneObject from '../SceneObject';

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

        super(vertexShader, fragmentShader, mesh.positions, mat)
    }

    swapShader(animationShader) {
        const { animationAttributes, uniforms, vertexShader, fragmentShader } = animationShader;
        const attributes = animationAttributes(mesh)
        [this.material.attributes, this.material.uniforms] = [attributes, uniforms]
    }
}

export default Icon
