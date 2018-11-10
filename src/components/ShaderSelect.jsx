import React from 'react'
import { connect } from 'react-redux'
import { setShaderName, cleanShaderAnimations } from '../actions';

const ShaderSelect = ({ disabled, onChange, setShaderName, name, cleanShaderAnimations }) => (
    <select
        name="shader-select"
        defaultValue={name}
        disabled={disabled}
        onChange={({ target: { value } }) => {
            cleanShaderAnimations()
            setShaderName(value)
            onChange(value)
        }}
    >
        <option value="anim">anim</option>
        <option value="idle">idle</option>
    </select>
)

export const mapStateToProps = state => ({
    name: state.shaderName,
})

export const mapDispatchToProps = dispatch => ({
    cleanShaderAnimations: () => dispatch(cleanShaderAnimations()),
    setShaderName: name => dispatch(setShaderName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ShaderSelect)
