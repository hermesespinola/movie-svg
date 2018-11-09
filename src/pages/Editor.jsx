import React, { Component } from 'react'
import { connect } from 'react-redux'
import svgMesh from 'svg-mesh-3d'
import { parse as extract } from 'extract-svg-path'
import Icon from '../js/Icon'
import IconPreview from '../components/IconPreview'
import InitialIconProps from '../components/InitialIconProps'
import ModelAnimationControls from '../components/ModelAnimationControls'
import ShaderAnimationControls from '../components/ShaderAnimationControls'
import Scene from '../js/Scene'
import { unindex, reindex } from '../js/lib/utils'
import idleAnimation from '../js/animationShaders/IdleAnimation'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            icon: null,
        }
        this.scene = null
        this.reader = new FileReader()
        this.reader.onload = ({ target: { result: svg } }) => {
            // extract and parse svg path
            const path = extract(svg)
    
            // create mesh object
            let mesh = svgMesh(path, {
                scale: 10,
                simplify: 0.1,
            })
            const triangles = unindex(mesh)
            mesh = reindex(triangles)
            if (this.state.icon) {
                this.scene.remove('icon')
            }
            this.setState({ icon: new Icon(mesh, idleAnimation) })
            this.scene.add('icon', this.state.icon).start()
        }
    }

    loadSvg = ({ target: { files } }) => {
        if (files[0]) {
            this.reader.readAsText(files[0])
        }
    }

    setScene = (canvasRef) => {
        this.scene = new Scene(canvasRef, [0, 0, 0, 1.], {
            click: () => {
                const { icon } = this.state
                const { animations, shaderAnimation } = this.props
                if (icon) {
                    icon.addAnimation(shaderAnimation.type, shaderAnimation.opts)
                    animations.forEach((anim) => {
                        if (anim.trigger === 'click') {
                            icon.addAnimation(anim.type, anim.opts)
                        }
                    })
                }
            },
            mouseenter: () => {
                const { icon } = this.state
                const { animations, shaderAnimation } = this.props
                if (icon) {
                    icon.addAnimation(shaderAnimation.type, shaderAnimation.opts)
                    animations.forEach((anim) => {
                        if (anim.trigger === 'enter') {
                            icon.addAnimation(anim.type, anim.opts)
                        }
                    })
                }
            },
            mouseleave: () => {
                const { icon } = this.state
                const { animations, shaderAnimation } = this.props
                if (icon) {
                    icon.addAnimation(shaderAnimation.type, shaderAnimation.opts)
                    animations.forEach((anim) => {
                        if (anim.trigger === 'leave') {
                            icon.addAnimation(anim.type, anim.opts)
                        }
                    })
                }
            },
        })
    }

    render() {
        const { icon } = this.state
        return (
            <div>
                <IconPreview icon={icon} onLoad={this.setScene} />
                <input type="file" accept="image/svg+xml" onChange={this.loadSvg} />
                <br/>
                <InitialIconProps icon={icon} />
                <ShaderAnimationControls icon={icon} />
                <ModelAnimationControls icon={icon} />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    animations: state.animations,
    shaderAnimation: state.shaderAnimation
})

export default connect(mapStateToProps)(App)
