import { ADD_ANIMATION, REMOVE_ANIMATION, UPDATE_ANIMATION } from '../constants/actionTypes'

export const addAnimation = animation => ({
    type: ADD_ANIMATION,
    animation,
})

export const removeAnimation = index => ({
    type: REMOVE_ANIMATION,
    index,
})

export const updateAnimation = (index, newAnimation) => ({
    type: UPDATE_ANIMATION,
    newAnimation,
    index,
})
