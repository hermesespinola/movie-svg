import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import AnimationModelControl from './AnimationModelControl'
import { addAnimation } from '../actions'

const defaultAnimationOpts = target => ({
    target,
    duration: 1.5,
    delay: 0.0,
    ease: 'linear',
})

const animControl = (anim, i) => (
    <AnimationModelControl
        key={`model-animation-control-${i}`}
        index={i}
        animation={anim}
    />
)

class ModelAnimationControls extends PureComponent {
    addAnimation(type) {
        const opts = defaultAnimationOpts([0, 0, 0])
        this.props.addAnimation({ trigger: 'click', type, opts })
    }

    render() {
        return (
            <div className="controls">
                <div className="addModelAnimations">
                    <button onClick={() => { this.addAnimation('color') }}>
                        Add color animation
                    </button>
                    <button onClick={() => { this.addAnimation('translation') }}>
                        Add translation animation
                    </button>
                    <button onClick={() => { this.addAnimation('scale') }}>
                        Add scale animation
                    </button>
                    <button onClick={() => { this.addAnimation('rotation') }}>
                        Add rotation animation
                    </button>
                </div>
                <div className="animation-editor">
                    {this.props.animations.map(animControl)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    animations: state.animations,
})

const mapDispatchToProps = dispatch => ({
    addAnimation: animation => dispatch(addAnimation(animation)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModelAnimationControls)
