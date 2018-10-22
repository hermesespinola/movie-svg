function idMaker() {
    let index = 0
    return () => ++index
}

const newId = idMaker()

const creteAnimationControls = (type) => {
    const controlId = newId()
    const wrapper = document.createElement('div')
    let targetInput
    switch (type) {
        case 'color':
            targetInput = `<input type="color" name="color" id="target-${controlId}">`
            break
        case 'transform':
        case 'scale':
        case 'rotation':
            targetInput = `<input type="text" name="${type}-${controlId}" id="target-${controlId}">`
            break
        default:
            targetInput = `<input type="number" name="${type}-${controlId}" id="target-${controlId}">`
            break
    }
    wrapper.innerHTML =
    `<div>
        Animate on: 
        <select name="material-type" id="animate-on-${controlId}">
                <option value="click">click</option>
                <option value="enter">enter</option>
                <option value="leave">leave</option>
        </select>
    </div>
    <div>Duration: <input type="number" name="delay" id="duration-${controlId}" min="0"></div>
    <div>Delay: <input type="number" name="delay" id="delay-${controlId}" min="0"></div>
    <div>
        Ease:
        <select name="material-type" id="ease-${controlId}">
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="linear">linear</option>
        </select>
    </div>
    <div>
        Target: ${targetInput}
    </div>
    <button id="remove-animation-${controlId}">Remove</button>
    <hr>`
    return [controlId, wrapper]
}

export default creteAnimationControls
