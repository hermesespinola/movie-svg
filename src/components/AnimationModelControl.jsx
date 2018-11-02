import React from 'react'
import { connect } from 'react-redux'
import Vector3Input from './Vector3Input'
import { removeAnimation, updateAnimation } from '../actions';

const AnimationModelControl = ({ animation, removeAnimation, updateAnimation, index }) => {
    const { type, opts: { target, duration, delay, ease } } = animation

    const updateAnimationOpt = (propName) => ({ target: { value } }) => {
        const newAnimation = { ...animation }
        newAnimation.opts[propName] = value
        updateAnimation(index, newAnimation)
    }

    let targetInput
    switch (type) {
        case 'color':
            targetInput = <input
                type="color"
                name="color-input"
                onChange={({ target: { value: hex } }) => {
                    const newAnimation = { ...animation }
                    const r = parseInt(hex.substring(1, 3), 16) / 255
                    const g = parseInt(hex.substring(3, 5), 16) / 255
                    const b = parseInt(hex.substring(5, 7), 16) / 255
                    newAnimation.opts.target = [r, g, b]
                    updateAnimation(index, newAnimation)
                }}
            />
            break
        default:
            targetInput = <Vector3Input
                defaultValue={target}
                onChange={(i, val) => {
                    const newAnimation = { ...animation }
                    const newVector = animation.opts.target.slice(0)
                    newVector[i] = val
                    newAnimation.opts.target = newVector
                    updateAnimation(index, newAnimation)
                }}
            />
            break
    }

    return (
        <div>
            <div>
                Trigger:
                <select
                    name="animation-trigger"
                    defaultValue="click"
                    onChange={({ target: { value: trigger } }) => {
                        const newAnimation = { ...animation, trigger }
                        updateAnimation(index, newAnimation)
                    }}
                >
                    <option value="click">click</option>
                    <option value="enter">enter</option>
                    <option value="leave">leave</option>
                    {/* TODO: add mousedown and mouseup */}
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
            <button onClick={() => { removeAnimation(index) }}>Remove</button>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    removeAnimation: index => dispatch(removeAnimation(index)),
    updateAnimation: (index, newAnimation) => dispatch(updateAnimation(index, newAnimation)),
})

export default connect(null, mapDispatchToProps)(AnimationModelControl)
