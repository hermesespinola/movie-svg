import React from 'react'
import { connect } from 'react-redux'
import { setAnimations, setShaderName, setShaderAnimations, setInitialAnimationState } from '../actions';

const LoadState = ({ disabled, setAnimations, setShaderAnimations, setShaderName, setInitialAnimationState }) => (
    <div>
        Load Animation:
        <input
            type="file"
            disabled={disabled}
            accept="application/json"
            multiple={false}
            onChange={({ target: { files } }) => {
                const [file] = files
                if (file) {
                    const fr = new FileReader()
                    fr.onload = function(e) { 
                        const state = JSON.parse(e.target.result)
                        const {
                            initialAnimationState,
                            animations,
                            shaderAnimations,
                            shaderName,
                        } = state
                        setShaderName(shaderName)
                        setInitialAnimationState(initialAnimationState)
                        setAnimations(animations)
                        setShaderAnimations(shaderAnimations)
                    }
                    fr.readAsText(file)
                }
            }}
        />
    </div>
)

const mapDispatchToProps = dispatch => ({
    setAnimations: animations => dispatch(setAnimations(animations)),
    setShaderAnimations: shaderAnimations => dispatch(setShaderAnimations(shaderAnimations)),
    setShaderName: name => dispatch(setShaderName(name)),
    setInitialAnimationState: initState => dispatch(setInitialAnimationState(initState)),
})

export default connect(null, mapDispatchToProps)(LoadState)
