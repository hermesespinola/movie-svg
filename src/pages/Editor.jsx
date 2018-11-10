import React, { Component, Fragment } from 'react'
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
import ExportButton from '../components/ExportButton'
import ShaderSelect from '../components/ShaderSelect'
import LoadState from '../components/LoadState'
import idleAnimation from '../js/animationShaders/IdleAnimation'
import animAnimation from '../js/animationShaders/AnimAnimation'
import { updateInitialUniforms, cleanShaderAnimations } from '../actions'

class Editor extends Component {
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

    componentDidUpdate(prevProps) {
        if (prevProps.shaderName !== this.props.shaderName) {
            cleanShaderAnimations()
            let shader
            switch (this.props.shaderName) {
                case 'idle':
                    shader = idleAnimation
                    break
                case 'anim':
                    shader = animAnimation
                    break
                default:
                    shader = idleAnimation
            }
            this.state.icon.swapShader(shader)
            this.props.updateInitialUniforms({ ...this.state.icon.material.uniforms })
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
                const { animations, shaderAnimations } = this.props
                if (icon) {
                    shaderAnimations.forEach((shaderAnimation) => {
                        if (shaderAnimation.trigger === 'click') {
                            icon.addAnimation(shaderAnimation.type, shaderAnimation.opts)
                        }
                    })
                    animations.forEach((anim) => {
                        if (anim.trigger === 'click') {
                            icon.addAnimation(anim.type, anim.opts)
                        }
                    })
                }
            },
            mouseenter: () => {
                const { icon } = this.state
                const { animations, shaderAnimations } = this.props
                if (icon) {
                    shaderAnimations.forEach((shaderAnimation) => {
                        if (shaderAnimation.trigger === 'enter') {
                            icon.addAnimation(shaderAnimation.type, shaderAnimation.opts)
                        }
                    })
                    animations.forEach((anim) => {
                        if (anim.trigger === 'enter') {
                            icon.addAnimation(anim.type, anim.opts)
                        }
                    })
                }
            },
            mouseleave: () => {
                const { icon } = this.state
                const { animations, shaderAnimations } = this.props
                if (icon) {
                    shaderAnimations.forEach((shaderAnimation) => {
                        if (shaderAnimation.trigger === 'leave') {
                            icon.addAnimation(shaderAnimation.type, shaderAnimation.opts)
                        }
                    })
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
        return [
            <IconPreview key="icon-preview" icon={icon} onLoad={this.setScene}>
                <input type="file" accept="image/svg+xml" onChange={this.loadSvg} />
                <br/>
                <LoadState disabled={icon === null} />
                <ShaderSelect disabled={icon === null} />
                <ExportButton />
                <InitialIconProps icon={icon} />
            </IconPreview>,
            icon && (
                <Fragment key="with-icon">
                    <ShaderAnimationControls key="shader-animation-controls" icon={icon} />
                    <ModelAnimationControls key="model-animation-controls" icon={icon} />
                </Fragment>
            ),
        ]
    }
}

const mapStateToProps = state => ({
    animations: state.animations,
    shaderAnimations: state.shaderAnimations,
    shaderName: state.shaderName,
})

const mapDispatchToProps = dispatch => ({
    updateInitialUniforms: uniforms => dispatch(updateInitialUniforms(uniforms)),
    cleanShaderAnimations: () => dispatch(cleanShaderAnimations()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
