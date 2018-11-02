import OrthoCamera from "./OrthoCamera"
import SceneObject from './SceneObject'

/**
 * A web-gl scene where objects can be placed and updated
 * @property sceneObjects {Map<string, SceneObject>} objects in the scene
 * @property camera {OrthoCamera} camera of the scene
 */
class Scene {
	/**
	 * Create a scene
	 * @param {string|HTMLCanvasElement} canvas The id of the canvas to init webgl context
	 * @param {number[]} bgColor background color of the scene
	 * @param {{ click?, keydown?, mouseenter?, mouseleave? }} listeners event listeners
	 */
	constructor(canvas, bgColor, listeners) {
		// Get a WebGL Context
		if (typeof canvas === 'string') {
			canvas = document.getElementById(canvas)
		}
		this.shouldRender = false
		this.gl = canvas.getContext("webgl")
		if (this.gl) {
			const [r, g, b, a] = bgColor
			this.gl.clearColor(r, g, b, a)
			this.canvas = canvas
			this.sceneObjects = new Map()
			// Create default camera and event listeners
			this.camera = new OrthoCamera(this.gl, this.canvas)
			this.attachListeners(listeners)
		} else {
			throw new Error('Unable to initialize web-gl context')
		}
		this.previousTime = 0.0
	}

	start() {
		if (!this.shouldRender) {
			this.shouldRender = true
			this.render()
		}
	}

	stop() {
		this.shouldRender = false
	}

	/**
	 * Attach listeners to the canvas
	 * @param {Map<string, EventHandlerNonNull>} listeners event listeners
	 * @private
	 */
	attachListeners({ click, keydown, mouseenter, mouseleave } = {}) {
		if (click) {
			this.canvas.onclick = event => {
				const x = event.clientX
				const y = event.clientY

				const rect = event.target.getBoundingClientRect()
				const xClip = 2 * (x - rect.left) / this.canvas.width - 1
				const yClip = 2 * (rect.top - y) / this.canvas.height + 1
				click({ x: xClip, y: yClip })
			}
		}
		if (mouseenter) {
			this.canvas.onmouseenter = mouseenter
		}
		if (mouseleave) {
			this.canvas.onmouseleave = mouseleave
		}
		if (keydown) {
			document.onkeydown = keydown
		}
	}

	/**
	 * Add a SceneObject to the Scene and re-render
	 * @param {string} name name of the object in the scene
	 * @param {SceneObject} sceneObject object to add
	 * @returns {Scene} this scene
	 */
	add(name, sceneObject) {
		sceneObject.init(this.gl, this)
		this.sceneObjects.set(name, sceneObject)
		return this
	}

	/**
	 * Remove a SceneObject from the Scene and re-render
	 * @param {string} name name of the object to remove
	 */
	remove(name) {
		this.sceneObjects.get(name).remove()
		this.sceneObjects.delete(name)
	}

	/**
	 * Render the scene to the canvas
	 */
	render() {
		if (this.shouldRender) {
			window.requestAnimationFrame(currentTime => {
				if (!this.previousTime) {
					this.previousTime = currentTime
				}
				const dt = (currentTime - this.previousTime) / 1000.0 // in seconds
				this.camera.update()
				this.sceneObjects.forEach(obj => obj.render(dt, this.camera))
				// TODO: update animation
				this.previousTime = currentTime
				this.render()
			})
		}
	}
}

export default Scene
