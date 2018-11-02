import { ADD_ANIMATION, REMOVE_ANIMATION, UPDATE_ANIMATION } from '../constants/actionTypes'
import { combineReducers } from 'redux'

const animations = (state = [], action) => {
    switch (action.type) {
        case ADD_ANIMATION:
            const addedAnimations = [...state, action.animation]
            return addedAnimations
        case REMOVE_ANIMATION:
            return state.filter((_, i) => i !== action.index)
        case UPDATE_ANIMATION:
            const { newAnimation, index } = action
            const updatedAnimations = [...state]
            updatedAnimations[index] = newAnimation
            return updatedAnimations
        default:
            return state
    }
}

export default combineReducers({ animations })