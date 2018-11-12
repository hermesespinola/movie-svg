import React from 'react'
import { connect } from 'react-redux'
import { setShaderName } from '../actions';

const ShaderSelect = ({ disabled, setShaderName, name }) => (
    <div className="animationShaderSelect">
        Animation Shader:
        <select
            name="shader-select"
            value={name}
            disabled={disabled}
            onChange={({ target: { value } }) => {
                setShaderName(value)
            }}
        >
            <option value="anim">anim</option>
            <option value="idle">idle</option>
        </select>
    </div>
)

const mapStateToProps = state => ({
    name: state.shaderName,
})

const mapDispatchToProps = dispatch => ({
    setShaderName: name => dispatch(setShaderName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ShaderSelect)
