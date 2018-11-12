import React from 'react'
import SceneObject from '../js/SceneObject'
import '../css/IconPreview.css'

const IconPreview = ({ icon, onLoad, children }) => (
    <div className="main">
        <canvas width={256} height={256} ref={onLoad} />
        <br/>
        { children }
    </div>
)

export default IconPreview
