import React from 'react'
import { connect } from 'react-redux'
import { removeShaderAnimation, updateShaderAnimation } from '../actions'

const ShaderAnimationControl = ({ animation, removeAnimation, updateAnimation, index, uniforms }) => {
    const { trigger, type, opts: { target, duration, delay, ease } } = animation

    const updateAnimationOpt = (propName) => ({ target: { value } }) => {
        const newShaderAnimation = { ...animation }
        const numVal = Number(value)
        newShaderAnimation.opts[propName] = isNaN(numVal) ? value : numVal
        updateAnimation(index, newShaderAnimation)
    }

    return (
        <div>
            <div>
                Trigger:
                <select
                    name="animation-trigger"
                    value={trigger}
                    onChange={({ target: { value: trigger } }) => {
                        const newAnimation = { ...animation, trigger }
                        updateAnimation(index, newAnimation)
                    }}
                >
                    <option value="click">click</option>
                    <option value="enter">enter</option>
                    <option value="leave">leave</option>
                </select>
            </div>
            <div>
                Uniform:
                <select
                    name="uniform"
                    min={0}
                    step={0.1}
                    defaultValue={type}
                    onChange={({ target: { value: type } }) => {
                        const newAnimation = { ...animation, type }
                        updateAnimation(index, newAnimation)
                    }}
                >
                    {
                        uniforms.map(name => <option key={name} value={name}>{name}</option>)
                    }
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
                Target:
                <input
                    type="number"
                    name="target"
                    min={0}
                    step={0.1}
                    defaultValue={target}
                    onChange={updateAnimationOpt('target')}
                />
            </div>
            <button onClick={() => { removeAnimation(index) }}>Remove</button>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    removeAnimation: index => dispatch(removeShaderAnimation(index)),
    updateAnimation: (index, shaderAnimation) => dispatch(updateShaderAnimation(index, shaderAnimation)),
})

export default connect(null, mapDispatchToProps)(ShaderAnimationControl)
