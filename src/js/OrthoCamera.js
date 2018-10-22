import { mat4, vec3 } from 'gl-matrix'

class OrthoCamera {
    /**
     * An Orthogonal Camera
     * @param {WebGLRenderingContext} gl web-gl context
     * @param {HTMLCanvasElement} canvas canvas element
     * @param {*} viewParams parameters for view transform
     * @param {*} projectionParams parameters for projection transform
     */
    constructor(
        gl,
        canvas,
        viewParams = {
            position: [0., 0., 1.],
            center: [0., 0., 0.],
            up: [0., 1., 0.],
        },
        projectionParams = {
            left: -1.,
            right: 1.,
            bottom: -1.,
            top: 1.,
            near: 0.001,
            far: 1000.,
        }
    ) {
        this.gl = gl
        this.canvas = canvas
        this.viewParams = viewParams

        // view
        this.view = mat4.create() // Mview = I
		const { position, center, up } = viewParams
        mat4.lookAt(this.view, position, center, up)

        // projection
        this.projection = mat4.create()
        const { left, right, bottom, top, near, far } = projectionParams
        mat4.ortho(this.projection, left, right, bottom, top, near, far)

        this.viewProjection = this.getViewProjMatrix()
    }

    /**
     * Move the camera transform to look at 'target' direction
     * @param {vec3} target The direction to look at
     */
    lookAt(target) {
        mat4.lookAt(this.view, this.viewParams.position, target, this.viewParams.up)
        this.viewProjection = this.getViewProjMatrix()
    }

    /**
     * Move camera to position
     * @param {vec3} position new position of the camera
     */
    move(position) {
        this.viewParams.position = position
        this.viewProjection = this.getViewProjMatrix()
    }

    /**
     * Recalculate the Model Projection Matrix
     * @private
     */
    getViewProjMatrix() {
        const res = mat4.create()
        return mat4.multiply(res, this.projection, this.view)
    }

    /**
     * Clear web-gl and set the viewport
     * @return the model-view projection matrix for the camera
     */
    update() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        // Mapping from clip-space coords to the viewport in pixels
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * @returns {mat4} the view-projection matrix
     */
    get viewProjMatrix() {
        return this.viewProjection
    }

    /**
     * @returns {mat4} the view matrix
     */
    get viewMatrix() {
        return this.view
    }

    /**
     * @returns {mat4} the projection matrix
     */
    get projectionMatrix() {
        return this.projection
    }
}

export default OrthoCamera
