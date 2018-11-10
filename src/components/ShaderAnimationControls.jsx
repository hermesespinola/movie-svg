import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShaderAnimationControl from './ShaderAnimationControl'
import { addShaderAnimation } from '../actions'
import '../css/AnimationControls.css'

const defaultAnimationOpts = target => ({
    target,
    duration: 1.5,
    delay: 0.0,
    ease: 'linear',
})

class ShaderAnimationControls extends PureComponent {
    addAnimation(type) {
        const opts = defaultAnimationOpts(0)
        this.props.addAnimation({ trigger: 'click', type, opts })
    }

    render() {
        const uniforms = Object.keys(this.props.icon.material.uniforms)
        return (
            <div className="controls">
                <div className="addModelAnimations">
                    <button onClick={() => {
                        this.addAnimation(uniforms[0])
                    }}>
                        Add shader animation
                    </button>
                </div>
                <div className="animation-editor">
                    {
                        this.props.animations.map((anim, i) => (
                            <ShaderAnimationControl
                                key={`shader-animation-control-${i}`}
                                index={i}
                                animation={anim}
                                uniforms={uniforms}
                            />
                        ))
                    }
                </div>
                <hr/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    animations: state.shaderAnimations,
})

const mapDispatchToProps = dispatch => ({
    addAnimation: shaderAnimation => dispatch(addShaderAnimation(shaderAnimation)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ShaderAnimationControls)
