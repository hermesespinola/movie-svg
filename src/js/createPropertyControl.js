import { SceneObject } from './webgl-app'

const positionLabels = 'xyz'
const colorLabels = 'rgb'

/**
 * Create controls to modify property descriptors of a given object
 * @param {SceneObject} sceneObject the object to modify
 * @param {string} propName property descriptor name (for getter and setter)
 */
const createPropertyControl = (sceneObject, propName) => {
    const type = sceneObject.propertyDescriptors[propName]
    const wrapper = document.createElement('div')
    wrapper.className = 'propWrapper'

    // Name of prop
    const header = document.createElement('h3')
    header.className = 'propHeader'
    header.innerText = propName
    wrapper.append(header)

    // Input of prop
    const prop = sceneObject[propName]
    const propDiv = document.createElement('div')
    if (Array.isArray(prop) || (ArrayBuffer.isView(prop) && !(prop instanceof DataView))) {
        propDiv.className = 'propsDiv'
        const props = [...prop]
        const propInputs = props.map(createInput.bind(null, type))
        propInputs.forEach(propInput => {
            propInput.onkeyup = propInput.onchange = ()  => {
                const values = propInputs.map(input => isNaN(input.value) ? 0 : Number(
                    type === 'color' ?
                        input.value / 255.0 :
                        input.value))
                sceneObject[propName] = values
                return false
            }
        })
        propInputs.forEach((input, i) => {
            const div = document.createElement('div')
            div.style.display = 'inline-block'
            const span = document.createElement('span')
            span.style.marginLeft = '10px'
            span.style.marginRight = '2px'
            span.innerText = type === 'color' ?
                colorLabels[i % colorLabels.length] :
                positionLabels[i % positionLabels.length]
            if (i !== 0 && i % 3 === 0) {
                propDiv.appendChild(document.createElement('br'))
            }
            propDiv.append(span, input)
        })
    } else {
        propDiv.className = 'propDiv'
        const propInput = createInput(type, prop)
        propInput.onkeyup = propInput.onchange = () => {
            sceneObject[propName] = propInput.value
            return false
        }
        propDiv.append(propInput)
    }
    wrapper.append(propDiv)
    return wrapper
}

/**
 * Create controls to modify property descriptors of a given object
 * @param {'number' | 'byte'} type
 * @param {number} prop the current value for the prop
 */
const createInput = (type, prop) => {
    switch (type) {
        case 'number':
            const nInput = document.createElement('input')
            nInput.type = 'text'
            nInput.value = prop.toFixed(4)
            return nInput
        case 'color':
        case 'byte':
            const bInput = document.createElement('input')
            bInput.type = 'range'
            bInput.min = '0'
            bInput.max = '255'
            bInput.value = type === 'color' ? prop.toFixed(4) * 255 : prop.toFixed(4)
            return bInput
    }
}

export default createPropertyControl
