import React from 'react'
import NumericInput from 'react-numeric-input'

const numField = (index, defaultValue, min, max, step, disabled, onChange) => (
    <NumericInput
        min={min}
        max={max}
        value={defaultValue}
        precision={2}
        step={step}
        onChange={(value) => {
            onChange(index, value)
        }}
        disabled={disabled}
        size={4}
        snap
    />
)

const Vector3Input = ({
    onChange,
    defaultValue=[0, 0, 0],
    min=-2, max=2,
    step=0.1,
    disabled=false,
}) => (
    <div className="vec3-input">
        {numField(0, defaultValue[0], min, max, step, disabled, onChange)}
        {numField(1, defaultValue[1], min, max, step, disabled, onChange)}
        {numField(2, defaultValue[2], min, max, step, disabled, onChange)}
    </div>
)

export default Vector3Input
