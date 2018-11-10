import {
    ADD_ANIMATION, ADD_SHADER_ANIMATION,
    REMOVE_ANIMATION, REMOVE_SHADER_ANIMATION,
    UPDATE_ANIMATION, UPDATE_SHADER_ANIMATION, CLEAN_ANIMATIONS, CLEAN_SHADER_ANIMATIONS,
} from '../constants/actionTypes'
import { combineReducers } from 'redux'

const animations = (state = [], action) => {
    switch (action.type) {
        case ADD_ANIMATION:
            const addedAnimations = [...state, action.animation]
            return addedAnimations
        case CLEAN_ANIMATIONS:
            return []
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

const shaderAnimations = (state=[], action) => {
    switch (action.type) {
        case ADD_SHADER_ANIMATION:
            const addedAnimations = [...state, action.shaderAnimation]
            return addedAnimations
        case CLEAN_SHADER_ANIMATIONS:
            return []
        case REMOVE_SHADER_ANIMATION:
            return state.filter((_, i) => i !== action.index)
        case UPDATE_SHADER_ANIMATION:
            const { shaderAnimation, index } = action
            const updatedAnimations = [...state]
            updatedAnimations[index] = shaderAnimation
            return updatedAnimations
        default:
            return state
    }
}

export default combineReducers({ animations, shaderAnimations })
