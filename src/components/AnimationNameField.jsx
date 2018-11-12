import React from 'react'
import { connect } from 'react-redux'
import { setAnimationName } from '../actions';

const AnimationNameField = ({ name, setAnimationName }) => (
    <div className="nameField">
        <input
            type="text"
            className="animationNameInput"
            value={name}
            onChange={({ target: { value } }) => {
                setAnimationName(value)
            }}
        />
    </div>
)

const mapStateToProps = state => ({
    name: state.animationName,
})

const mapDispatchToProps = dispatch => ({
    setAnimationName: name => dispatch(setAnimationName(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AnimationNameField)
