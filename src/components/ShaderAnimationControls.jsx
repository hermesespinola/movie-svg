import React from 'react'
import { connect } from 'react-redux'
import Vector3Input from './Vector3Input'
import { updateShaderAnimation } from '../actions';

const ShaderAnimationControls = ({ animation, updateShaderAnimation, icon }) => {
    if (!icon) {
        return null
    }
    const { type, opts: { target, duration, delay, ease } } = animation

    const updateAnimationOpt = (propName) => ({ target: { value } }) => {
        const newAnimation = { ...animation }
        const numVal = Number(value)
        newAnimation.opts[propName] = isNaN(numVal) ? value : numVal
        updateShaderAnimation(newAnimation)
    }

    let targetInput = (
        <input
            type="number"
            name="duration"
            min={0}
            step={0.1}
            defaultValue={target}
            onChange={updateAnimationOpt('target')}
        />
    )

    return (
        <div>
            <h4>Shader Animation</h4>
            <div>
                Trigger:
                <select
                    name="animation-trigger"
                    defaultValue="click"
                    onChange={({ target: { value: trigger } }) => {
                        const newAnimation = { ...animation, trigger }
                        updateShaderAnimation(newAnimation)
                    }}
                >
                    <option value="click">click</option>
                    <option value="enter">enter</option>
                    <option value="leave">leave</option>
                    {/* TODO: add mousedown and mouseup */}
                </select>
            </div>
            <div>
                Type:
                <select
                    name="animation-trigger"
                    defaultValue="click"
                    onChange={({ target: { value: trigger } }) => {
                        const newAnimation = { ...animation, trigger }
                        updateShaderAnimation(newAnimation)
                    }}
                >
                    {Object.keys(icon.material.uniforms).map((name, i) =>
                        <option key={i} value={name}>{name}</option>)}
                </select>
            </div>
            <div>
                Duration:
                <input
                    type="number"
                    name="duration"
                    min={0}
                    step={0.1}
                    defaultValue={duration}
                    onChange={updateAnimationOpt('duration')}
                />
            </div>
            <div>
                Delay:
                <input
                    type="number"
                    name="delay"
                    min={0}
                    step={0.1}
                    defaultValue={delay}
                    onChange={updateAnimationOpt('delay')}
                />
            </div>
            <div>
                Ease:
                <select name="ease" defaultValue={ease} onChange={updateAnimationOpt('ease')}>
                    <option value="ease">ease</option>
                    <option value="ease-in">ease-in</option>
                    <option value="ease-out">ease-out</option>
                    <option value="ease-in-out">ease-in-out</option>
                    <option value="linear">linear</option>
                </select>
            </div>
            <div>
                Target: {targetInput}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    animation: state.shaderAnimation,
})

const mapDispatchToProps = dispatch => ({
    updateShaderAnimation: (newAnimation) => dispatch(updateShaderAnimation(newAnimation)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ShaderAnimationControls)
