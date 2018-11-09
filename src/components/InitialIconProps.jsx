import React, { Fragment, PureComponent } from 'react'
import Vector3Input from './Vector3Input'

// TODO: connect to redux
class InitialIconProps extends PureComponent {
    constructor(props) {
        super(props)
        this.translation = [0, 0, 0]
        this.scale = [1, 1, 1]
        this.rotation = [0, 0, 0]
        this.color = [1, 1, 1]
    }

    reset() {
        const { icon } = this.props
        icon.translation = this.translation
        icon.scale = this.scale
        icon.rotation = this.rotation
        icon.material.color = this.color
    }

    componentDidUpdate() {
        this.reset()
    }

    render() {
        const { icon } = this.props
        return (
            <div>
                <h4>Initial Model State</h4>
                <div>
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
                        defaultValue="#ffffff"
                        disabled={icon === null}
                        onChange={({ target: { value: hex } }) => {
                            const r = parseInt(hex.substring(1, 3), 16) / 255
                            const g = parseInt(hex.substring(3, 5), 16) / 255
                            const b = parseInt(hex.substring(5, 7), 16) / 255
                            this.color = icon.material.color = [r, g, b]
                        }}
                    />
                </div>
                <div>
                    Initial translation:
                    <Vector3Input
                        defaultValue={this.translation}
                        disabled={icon === null}
                        onChange={(index, value) => {
                            const [x, y, z] = icon.translation
                            switch (index) {
                                case 0:
                                    this.translation = icon.translation = [value, y, z]
                                    break
                                case 1:
                                    this.translation = icon.translation = [x, value, z]
                                    break
                                case 2:
                                    this.translation = icon.translation = [x, y, value]
                                    break
                            }
                        }}
                    />
                </div>
                <div>
                    Initial scale:
                    <Vector3Input
                        defaultValue={this.scale}
                        disabled={icon === null}
                        onChange={(index, value) => {
                            const [x, y, z] = icon.scale
                            switch (index) {
                                case 0:
                                    this.scale = icon.scale = [value, y, z]
                                    break
                                case 1:
                                    this.scale = icon.scale = [x, value, z]
                                    break
                                case 2:
                                    this.scale = icon.scale = [x, y, value]
                                    break
                            }
                        }}
                    />
                </div>
                <div>
                    Initial rotation:
                    <Vector3Input
                        defaultValue={this.rotation}
                        min={-360}
                        max={360}
                        step={10}
                        disabled={icon === null}
                        onChange={(index, value) => {
                            const [x, y, z] = icon.rotation
                            switch (index) {
                                case 0:
                                    this.rotation = icon.rotation = [value, y, z]
                                    break
                                case 1:
                                    this.rotation = icon.rotation = [x, value, z]
                                    break
                                case 2:
                                    this.rotation = icon.rotation = [x, y, value]
                                    break
                            }
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default InitialIconProps
