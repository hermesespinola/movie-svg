import { mat4, vec3, quat } from 'gl-matrix'
import { createShader, createShaderProgram } from './lib/create-shaders'
import MaterialAnimation from './ModelAnimation'
import Scene from './Scene'
import { flatten } from './lib/utils'

const defaultTranslation = vec3.fromValues(0., 0., 0.)
const defaultRotation = quat.fromEuler([], 0., 0., 0.)
const defaultScale = vec3.fromValues(1.0, 1.0, 1.0)
export const defaultTransformOpts = {
    translation: defaultTranslation,
    rotation: defaultRotation,
    scale: defaultScale,
}
export const defaultMaterial = {
    type: 6,
    color: [1., 1., 1.],
    attributes: [],
    uniforms: [],
}

/**
 * Base object for rendering in a Scene
 * @param {WebGLRenderingContext} gl web-gl context, only available after attached to a scene
 * @property {Scene} scene scene to which this object is attached, only available after attached to a scene
 * @property {{string: 'number'|'byte'}} propertyDescriptors Describe properties with getter and setters
 */
class SceneObject {
    /**
     * Create a scene object
     * @param {string} vertexShaderSrc Source string for the vertex shader
     * @param {string} fragmentShaderSrc Source string for the fragment shader
     * @param {number[]} geometry
     */
    constructor(
        vertexShaderSrc,
        fragmentShaderSrc,
        mesh,
        material = defaultMaterial,
    ) {
        this.vertexShaderSrc = vertexShaderSrc
        this.fragShaderSrc = fragmentShaderSrc
        this.shaderProgram = null
        this.scene = null
        this.gl = null
        this.mesh = mesh
        this.centroid = [0, 0, 0]
        this.transform = mat4.create()
        this.animations = []
        const v = vec3.create()
        this.eulerRotation = vec3.transformQuat(v, v, defaultTransformOpts.rotation)
        this.material = material
        mat4.fromRotationTranslationScale(
            this.transform,
            defaultTransformOpts.rotation,
            defaultTransformOpts.translation,
            defaultTransformOpts.scale,
        )
    }

    /**
     * Only meant to be called when this object is attached to the scene
     * @param {WebGLRenderingContext} gl web-gl context
     * @param {Scene} scene scene to which this object is attached
     */
    init(gl, scene) {
        this.scene = scene
        this.gl = gl
        // Create GLSL shaders (upload source & compile shaders)
		this.vertexShader = createShader(gl, gl.VERTEX_SHADER, this.vertexShaderSrc)
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, this.fragShaderSrc)
        delete this.vertexShaderSrc
        delete this.fragShaderSrc
        this.shaderProgram = createShaderProgram(gl, this.vertexShader, this.fragmentShader)
        this.uModelViewMatrix = gl.getUniformLocation(this.shaderProgram, 'modelViewMatrix')

        // find location of custom attributes
        for (let uniformName in this.material.uniforms) {
            const uniform = this.material.uniforms[uniformName]
            uniform.location = gl.getUniformLocation(this.shaderProgram, uniformName)
        }

        this.uColor = gl.getUniformLocation(this.shaderProgram, 'color')
        // Look up into the vertex shader where the CPU's vertex data go
        this.aPosition = gl.getAttribLocation(this.shaderProgram, 'position')
        this.positionBuffer = gl.createBuffer()

        // find location of custom attributes
        for (let attribName in this.material.attributes) {
            const attribute = this.material.attributes[attribName]
            attribute.location = gl.getAttribLocation(this.shaderProgram, attribName)
            attribute.buffer = gl.createBuffer()
        }
    }

    swapShader(animationShader) {
        const { animationAttributes, uniforms, vertexShader, fragmentShader } = animationShader
        this.remove()
        this.vertexShaderSrc = vertexShader
        this.fragShaderSrc = fragmentShader
        const attributes = animationAttributes(this.mesh)
        this.material.attributes = attributes
        this.material.uniforms = uniforms
        this.init(this.gl, this.scene)
    }

    get translation() {
        return mat4.getTranslation(vec3.create(), this.transform)
    }

    set translation(translation) {
        [this.transform[12] = 0, this.transform[13] = 0, this.transform[14] = 0] = translation
    }

    get scale() {
        return mat4.getScaling(vec3.create(), this.transform)
    }

    set scale(scale) {
        const rotation = quat.fromEuler(quat.create(), ...this.eulerRotation)
        mat4.fromRotationTranslationScale(this.transform, rotation, this.translation, scale)
    }

    get rotation() {
        return this.eulerRotation
    }
    
    set rotation([x = 0, y = 0, z = 0]) {
        this.eulerRotation = [x, y, z]
        mat4.fromRotationTranslationScale(this.transform, quat.fromEuler(quat.create(), x, y, z), this.translation, this.scale)
    }

    /**
     * Only meant to be called when this object is detached from the scene
     */
	remove() {
		this.gl.deleteBuffer(this.positionBuffer)
        this.gl.deleteShader(this.vertexShader)
        this.gl.deleteShader(this.fragmentShader)
        this.gl.deleteProgram(this.shaderProgram)
    }
    
    /**
     * Translates the object by `to`.
     * @param {vec3 | number[]} to
     */
    translate(to) {
        mat4.translate(this.transform, this.transform, to)
    }

    /**
	 * Rotate the object by `angle` on the z axis
     * @param {number} angle in radians
     */
	rotateZ(angle) {
        mat4.rotateZ(this.transform, this.transform, angle)
        this.eulerRotation[2] += angle
    }

    /**
     * Rotate the object by `angle` on the x axis
     * @param {number} angle in radians
     */
    rotateX(angle) {
        mat4.rotateX(this.transform, this.transform, angle)
        this.eulerRotation[0] += angle
    }

    /**
     * Rotate the object by `angle` on the y axis
     * @param {number} angle in radians
     */
    rotateY(angle) {
        mat4.rotateY(this.transform, this.transform, angle)
        this.eulerRotation[1] += angle
    }

    /**
     * add an animation to an SceneObject property
     * @param {string} propName Name of a uniform value or transform property
     * @param {object} opts animation options
     */
    addAnimation(propName, opts) {
        let animation = null
        switch(propName) {
            case 'color':
                animation = new MaterialAnimation(this.material, propName, 'vec3', opts)
                this.animations.push(animation)
                break
            case 'translation':
                animation = new MaterialAnimation(this, propName, 'vec3', opts)
                this.animations.push(animation)
                break
            case 'rotation':
                animation = new MaterialAnimation(this, propName, 'vec3', opts)
                this.animations.push(animation)
                break
            case 'scale':
                animation = new MaterialAnimation(this, propName, 'vec3', opts)
                this.animations.push(animation)
                break
            default:
                animation = new MaterialAnimation(this.material.uniforms[propName], 'value', this.material.uniforms[propName].type, opts)
                this.animations.push(animation)
                break
        }
        return animation
    }

    /**
     * @param {number} dt the time lapse between the previus render and the current one
     */
    render(dt, camera) {
        // first run animations
        let i = this.animations.length - 1
        while (i >= 0) {
            const animation = this.animations[i]
            animation.update(dt)
            if (animation.isComplete) {
                this.animations.splice(i, 1)
            }
            i -= 1
        }

        // Load uniform data into the GPU
        this.gl.useProgram(this.shaderProgram)
        const modelViewProj = mat4.create()
        mat4.mul(modelViewProj, camera.viewProjMatrix, this.transform)
        this.gl.uniformMatrix4fv(this.uModelViewMatrix, false, modelViewProj)
        this.gl.uniform3fv(this.uColor, this.material.color)

        // load custom uniform data
        for (let uniformName in this.material.uniforms) {
            const uniform = this.material.uniforms[uniformName]
            switch (uniform.type) {
                case 'float':
                    this.gl.uniform1f(uniform.location, uniform.value)
                    break
                case 'vec3':
                    this.gl.uniform3fv(uniform.location, flatten(uniform.value, 3))
                    break
            }
        }

        // send position attributes
        const dims = this.mesh.positions[0].length
		this.gl.enableVertexAttribArray(this.aPosition)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.mesh.positions, dims), this.gl.STATIC_DRAW)
        this.gl.vertexAttribPointer(this.aPosition, dims, this.gl.FLOAT, false, 0, 0)

        // send custom attributes
        for (let attribName in this.material.attributes) {
            const attribute = this.material.attributes[attribName]
            switch (attribute.type) {
                // actually I only care for v3 case
                case 'vec3':
                    this.gl.enableVertexAttribArray(attribute.location)
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(attribute.value, 3), this.gl.STATIC_DRAW)
                    this.gl.vertexAttribPointer(attribute.location, 3, this.gl.FLOAT, false, 0, 0)
                    break
            }
        }

        this.gl.drawArrays(this.material.type, 0, this.mesh.positions.length)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    }

    /**
     * Add a new propery descriptor for this object
     * @param {string} name property descriptor name (for getter and setter)
     * @param {'number' | 'byte'| 'color'} type
     */
    addPropertyDescriptor(name, type) {
        this.propertyDescriptors[name] = type
        this.gl.TRIANGLES
    }
}

SceneObject.type = Object.freeze({ SOLID: 6, WIREFRAME: 2, POINTS: 0, TRIANGLES: 4, LINESTRIP: 3, LINES: 1 })
export default SceneObject
