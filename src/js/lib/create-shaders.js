/**
 * Create a shader object
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @return WebGLShader
 */
export const createShader = (gl, type, source) => {
	const shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (success)  {
		return shader
	} else {
		gl.deleteShader(shader)
	}
}

/**
 * link shaders and create shader program
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @return WebGLProgram
 */
export const createShaderProgram = (gl, vertexShader, fragmentShader) => {
	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const success = gl.getProgramParameter(program, gl.LINK_STATUS)
	if(success) {
		return program
	} else {
		console.log(gl.getShaderInfoLog(program))
		gl.deleteShader(program)
	}
}
