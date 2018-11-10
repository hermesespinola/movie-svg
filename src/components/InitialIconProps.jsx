import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Vector3Input from './Vector3Input'
import {
    updateInitialTranslation, updateInitialColor,
    updateInitialRotation, updateInitialScale,
    updateInitialUniforms,
} from '../actions';
import '../css/InitialIconProps.css'

const rgbToHex = (val) => {
    const hex = Number(val * 255).toString(16);
    return hex.length < 2 ? `0${hex}` : hex
}

class InitialIconProps extends PureComponent {
    reset() {
        const { icon, translation, scale, rotation, color, uniforms } = this.props
        icon.translation = translation
        icon.scale = scale
        icon.rotation = rotation
        icon.material.color = color
        Object.keys(icon.material.uniforms).forEach((uniform) => {
            icon.material.uniforms[uniform].value = uniforms[uniform].value
        })
    }

    componentDidUpdate() {
        this.reset()
    }

    hexColor() {
        const { color } = this.props
        var red = rgbToHex(color[0]);
        var green = rgbToHex(color[1]);
        var blue = rgbToHex(color[2]);
        return `#${red}${green}${blue}`;
    }

    render() {
        const {
            updateInitialColor, updateInitialRotation, updateInitialScale,
            updateInitialTranslation, updateInitialUniforms,
            icon, translation, scale, rotation, uniforms,
        } = this.props
        return (
            <div className="initialAnimationStateWrapper">
                <h3>Initial Animation State</h3>
                <div className="reset-initial-wrapper">
                    <button onClick={() => {
                        this.reset()
                    }} >
                        Reset model
                    </button>
                </div>
                <div>
                    Initial color:
                    <input
                        type="color"
                        defaultValue={this.hexColor()}
                        disabled={icon === null}
                        onChange={({ target: { value: hex } }) => {
                            const r = parseInt(hex.substring(1, 3), 16) / 255
                            const g = parseInt(hex.substring(3, 5), 16) / 255
                            const b = parseInt(hex.substring(5, 7), 16) / 255
                            updateInitialColor([r, g, b])
                        }}
                    />
                </div>
                <div>
                    Initial translation:
                    <Vector3Input
                        defaultValue={translation}
                        disabled={icon === null}
                        onChange={(index, value) => {
                            const [x, y, z] = translation
                            switch (index) {
                                case 0:
                                    updateInitialTranslation([value, y, z])
                                    break
                                case 1:
                                    updateInitialTranslation([x, value, z])
                                    break
                                case 2:
                                    updateInitialTranslation([x, y, value])
                                    break
                            }
                        }}
                    />
                </div>
                <div>
                    Initial scale:
                    <Vector3Input
                        defaultValue={scale}
                        disabled={icon === null}
                        onChange={(index, value) => {
                            const [x, y, z] = scale
                            switch (index) {
                                case 0:
                                    updateInitialScale([value, y, z])
                                    break
                                case 1:
                                    updateInitialScale([x, value, z])
                                    break
                                case 2:
                                    updateInitialScale([x, y, value])
                                    break
                            }
                        }}
                    />
                </div>
                <div>
                    Initial rotation:
                    <Vector3Input
                        defaultValue={rotation}
                        min={-360}
                        max={360}
                        step={10}
                        disabled={icon === null}
                        onChange={(index, value) => {
                            const [x, y, z] = rotation
                            switch (index) {
                                case 0:
                                    updateInitialRotation([value, y, z])
                                    break
                                case 1:
                                    updateInitialRotation([x, value, z])
                                    break
                                case 2:
                                    updateInitialRotation([x, y, value])
                                    break
                            }
                        }}
                    />
                </div>
                <div>
                    <b>Initial uniforms:</b>
                    {Object.keys(uniforms).map(name => (
                        <div key={name} className="initialUniformValue">
                            {name}:
                            <input
                                type="number"
                                disabled={icon === null}
                                step={0.1}
                                defaultValue={uniforms[name].value}
                                onChange={({ target: { value } }) => {
                                    const newUniforms = {
                                        ...uniforms,
                                        [name]: {
                                            type: 'float',
                                            value: Number(value),
                                        }
                                    }
                                    updateInitialUniforms(newUniforms)
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    translation: state.initialAnimationState.translation,
    uniforms: state.initialAnimationState.uniforms,
    rotation: state.initialAnimationState.rotation,
    scale: state.initialAnimationState.scale,
    color: state.initialAnimationState.color,
})

const mapDispatchToProps = dispatch => ({
    updateInitialTranslation: translation => dispatch(updateInitialTranslation(translation)),
    updateInitialScale: scale => dispatch(updateInitialScale(scale)),
    updateInitialColor: color => dispatch(updateInitialColor(color)),
    updateInitialRotation: rotation => dispatch(updateInitialRotation(rotation)),
    updateInitialUniforms: uniforms => dispatch(updateInitialUniforms(uniforms)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InitialIconProps)
