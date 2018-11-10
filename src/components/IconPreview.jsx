import React from 'react'
import SceneObject from '../js/SceneObject'
import '../css/IconPreview.css'

const IconPreview = ({ icon, onLoad, children }) => (
    <div className="main">
        <canvas width={256} height={256} ref={onLoad} />
        <br/>
        {icon && (
            <select
                name="material-type"
                defaultValue="TRIANGLES"
                onChange={({ target: { value } }) => {
                    icon.material.type = SceneObject.type[value]
                }}
            >
                <option value="TRIANGLES">Triangles</option>
                <option value="LINESTRIP">Line strip</option>
                <option value="LINES">Lines</option>
                <option value="SOLID">Solid</option>
                <option value="WIREFRAME">Wireframe</option>
            </select>
        )}
        { children }
    </div>
)

export default IconPreview
