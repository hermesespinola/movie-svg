import React from 'react'
import { connect } from 'react-redux'
import { setDrawMethod } from '../actions'
import SceneObject from '../js/SceneObject'

const DrawMethod = ({ disabled, drawMethod, setDrawMethod }) => (
    <select
        name="material-type"
        disabled={disabled}
        value={drawMethod}
        onChange={({ target: { value } }) => {
            setDrawMethod(value)
        }}
    >
    {Object.keys(SceneObject.type).map(drawMethod => (
        <option key={drawMethod} value={drawMethod}>{drawMethod.toLowerCase()}</option>
    ))}
</select>
)

const mapStateToProps = state => ({
    drawMethod: state.drawMethod,
})

const mapDispatchToProps = dispatch => ({
    setDrawMethod: method => dispatch(setDrawMethod(method))
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawMethod)
