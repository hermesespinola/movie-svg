import {
    UPDATE_INITIAL_ROTATION, UPDATE_INITIAL_SCALE, UPDATE_INITIAL_UNIFORMS,
    UPDATE_INITIAL_TRANSLATION, UPDATE_INITIAL_COLOR,
    ADD_ANIMATION, ADD_SHADER_ANIMATION,
    REMOVE_ANIMATION, REMOVE_SHADER_ANIMATION,
    UPDATE_ANIMATION, UPDATE_SHADER_ANIMATION,
    CLEAN_ANIMATIONS, CLEAN_SHADER_ANIMATIONS, SET_SHADER_NAME, SET_INITIAL_ANIMATION_STATE, SET_ANIMATIONS, SET_SHADER_ANIMATIONS,
} from '../constants/actionTypes'
import { combineReducers } from 'redux'

const initAnimState = {
    color: [1, 1, 1],
    translation: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    uniforms: {
        triangleScale: {
            type: 'float',
            value: 1.0,
        },
        opacity: {
            type: 'float',
            value: 1.0,
        },
    },
}

const initialAnimationState = (state = initAnimState, action) => {
    switch (action.type) {
        case SET_INITIAL_ANIMATION_STATE:
            return action.initState
        case UPDATE_INITIAL_TRANSLATION:
            const { translation } = action
            return { ...state, translation }
        case UPDATE_INITIAL_COLOR:
            const { color } = action
            return { ...state, color }
        case UPDATE_INITIAL_ROTATION:
            const { rotation } = action
            return { ...state, rotation }
        case UPDATE_INITIAL_SCALE:
            const { scale } = action
            return { ...state, scale }
        case UPDATE_INITIAL_UNIFORMS:
            const { uniforms } = action
            return { ...state, uniforms }
        default:
            return state
    }
}

const animations = (state = [], action) => {
    switch (action.type) {
        case SET_ANIMATIONS:
            return action.animations
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

const shaderAnimations = (state = [], action) => {
    switch (action.type) {
        case SET_SHADER_ANIMATIONS:
            return action.shaderAnimations
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

const shaderName = (state = 'idle', action) => {
    if (action.type === SET_SHADER_NAME) {
        return action.shaderName
    } else {
        return state
    }
}

export default combineReducers({ initialAnimationState, animations, shaderAnimations, shaderName })
