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
import AnimationNameField from '../components/AnimationNameField'
import DrawMethod from '../components/DrawMethod'
import ShaderSelect from '../components/ShaderSelect'
import LoadState from '../components/LoadState'
import idleAnimation from '../js/animationShaders/IdleAnimation'
import animAnimation from '../js/animationShaders/AnimAnimation'
import { getAnimation } from '../utils/animationRequests'
import {
    updateInitialUniforms, cleanShaderAnimations,
    setShaderName, setAnimations, setAnimationName,
    setShaderAnimations, setInitialAnimationState, setDrawMethod
} from '../actions'
import SceneObject from '../js/SceneObject'

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            icon: null,
            loading: true,
        }
        this.reader = new FileReader()
        this.reader.onload = ({ target: { result: svg } }) => {
            if (this.scene) {
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

                const icon = new Icon(mesh, this.getAnimationShader())
                icon.material.type = SceneObject.type[this.props.drawMethod]
                this.setState({ icon })
                this.scene.add('icon', this.state.icon).start()
            }
        }
    }

    componentWillUnmount() {
        this.scene.stop()
        this.createScene = () => {}
    }

    componentDidMount() {
        const { match: { params: { id } } } = this.props
        if (id) {
            getAnimation(id).then(({ data: animation }) => {
                const {
                    setAnimations, setShaderAnimations,
                    setInitialAnimationState, setShaderName,
                    setAnimationName,
                } = this.props
                const {
                    animations, shaderAnimations,
                    initialAnimationState, name,
                    shaderName, drawMethod,
                } = animation
                setAnimationName(name)
                setShaderName(shaderName)
                setInitialAnimationState(initialAnimationState)
                setAnimations(animations)
                setShaderAnimations(shaderAnimations)
                setDrawMethod(drawMethod)
                this.setState({ loading: false })
            })
        } else {
            this.setState({ loading: false })
        }
    }

    getAnimationShader() {
        switch (this.props.shaderName) {
            case 'idle':
                return idleAnimation
                break
            case 'anim':
                return animAnimation
                break
            default:
                return idleAnimation
        }
    }

    componentDidUpdate(prevProps) {
        const { icon } = this.state
        if (icon && prevProps.drawMethod !== this.props.drawMethod) {
            icon.material.type = SceneObject.type[this.props.drawMethod]
        }
        if (icon && prevProps.shaderName !== this.props.shaderName) {
            console.log(icon.material.type)
            this.props.cleanShaderAnimations()
            icon.swapShader(this.getAnimationShader())
            this.props.updateInitialUniforms({ ...icon.material.uniforms })
        }
    }

    loadSvg = ({ target: { files } }) => {
        if (files[0]) {
            this.reader.readAsText(files[0])
        }
    }

    createScene = (canvasRef) => {
        if (!canvasRef) {
            return
        }
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
        const { icon, loading } = this.state
        const { match: { params: { id } } } = this.props
        return loading ? <div className="loading">Loading...</div> : [
            <IconPreview key="icon-preview" icon={icon} onLoad={this.createScene}>
                <input type="file" accept="image/svg+xml" onChange={this.loadSvg} />
                <br/>
                <DrawMethod disabled={icon === null} />
                <LoadState disabled={icon === null} />
                <ShaderSelect disabled={icon === null} />
                <ExportButton animationId={id} />
                <AnimationNameField />
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
    drawMethod: state.drawMethod,
})

const mapDispatchToProps = dispatch => ({
    updateInitialUniforms: uniforms => dispatch(updateInitialUniforms(uniforms)),
    cleanShaderAnimations: () => dispatch(cleanShaderAnimations()),
    setShaderName: name => dispatch(setShaderName(name)),
    setAnimations: animations => dispatch(setAnimations(animations)),
    setShaderAnimations: shaderAnimations => dispatch(setShaderAnimations(shaderAnimations)),
    setInitialAnimationState: initState => dispatch(setInitialAnimationState(initState)),
    setAnimationName: name => dispatch(setAnimationName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
