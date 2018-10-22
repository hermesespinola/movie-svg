import { parse as extract } from 'extract-svg-path'
import svgMesh from 'svg-mesh-3d'
import Icon from './Icon'
import Scene from './Scene'
import SceneObject from './SceneObject'
import { unindex, reindex } from './lib/utils'
import createAnimationControls from './createAnimationControls'

// constants
const canvas = document.createElement('canvas')
canvas.id = 'editor-preview'
const clearColor = [0, 0, 0, 0]
const objectID = 'icon'
const size = 256
canvas.width = size
canvas.height = size

// scene init
const scene = new Scene(canvas, clearColor)
// Put canvas in document
const wrapper = document.getElementById('canvas-container')
wrapper.appendChild(canvas)
let icon, animations = { click: {}, enter: {}, leave: {} }

// icon animations
scene.attachListeners({
    click() {
        if (icon) {
            icon.addAnimation('color', {
                target: [46 / 255, 73 / 255, 255 / 255],
                duration: 1.0,
                delay: 0.0,
                ease: 'ease-out',
            })
            icon.addAnimation('rotation', {
                target: [0.0, 0.0, 360.0 * 2],
                duration: 1.0,
                delay: 0.0,
                ease: 'ease',
            })
            icon.addAnimation('scale', {
                target: [0, 0, 0],
                duration: 1.0,
                delay: 0.0,
                ease: 'ease',
            })
            icon.addAnimation('scale', {
                target: [1, 1, 1],
                duration: 1.0,
                delay: 1.0,
                ease: 'ease',
            })
            icon.addAnimation('rotation', {
                target: [0.0, 0.0, 0.0],
                duration: 1.0,
                delay: 1.0,
                ease: 'ease',
            })
        }
    },
    mouseenter() {

    },
    mouseleave() {

    }
})

// handle svg input
function fileChange() {
    const reader = new FileReader()
    reader.onload = ({ target: { result: svg } }) => {
        // extract and parse svg path
        const path = extract(svg)

        // create mesh object
        const mesh = reindex(unindex(svgMesh(path, { scale: 10, simplify: 0.1 })))
        if (icon) {
            scene.remove(objectID)
        }
        icon = new Icon(mesh)
        scene.add(objectID, icon)
        scene.start()

        // reset values
        document.getElementById('material-type').value = 'TRIANGLES'
        document.getElementById('from-color').value = '#ffffff'
    }
    // read svg contents
    reader.readAsText(this.files[0])
}
document.getElementById('load-svg').addEventListener('change', fileChange, false)

document.getElementById('from-color').addEventListener('change', ({ target: { value: hex } }) => {
    if (icon) {
        const r = parseInt(hex.substring(1, 3), 16) / 255
        const g = parseInt(hex.substring(3, 5), 16) / 255
        const b = parseInt(hex.substring(5, 7), 16) / 255
        icon.material.color = [r, g, b]
    }
})

document.getElementById('material-type').addEventListener('change', ({ target: { value } }) => {
    if (icon) {
        icon.material.type = SceneObject.type[value]
    }
})

addAnimationListeners = (id, type) => {
    document.getElementById(`target-${id}`).addEventListener('change', ({ target: { value } }) =>  {

    })
    document.getElementById(`ease-${id}`).addEventListener('change', ({ target: { value } }) =>  {

    })
    document.getElementById(`animate-on-${id}`).addEventListener('change', ({ target: { value } }) =>  {

    })
}

document.getElementById('add-animation-color').addEventListener('click', () => {
    const [id, newControls] = createAnimationControls('color')
    document.getElementById('animation-editor-controls').appendChild(newControls)
    addAnimationListeners(id, 'color')
})

document.getElementById('add-animation-transform').addEventListener('click', () => {
    const [id, newControls] = createAnimationControls('transform')
    document.getElementById('animation-editor-controls').appendChild(newControls)
    addAnimationListeners(id, 'transform')
})

document.getElementById('add-animation-scale').addEventListener('click', () => {
    const [id, newControls] = createAnimationControls('scale')
    document.getElementById('animation-editor-controls').appendChild(newControls)
    addAnimationListeners(id, 'scale')
})

document.getElementById('add-animation-rotation').addEventListener('click', () => {
    const newControls = createAnimationControls('rotation')
    addAnimationListeners(id, 'rotation')
})
