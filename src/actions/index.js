import {
    UPDATE_INITIAL_SCALE, UPDATE_INITIAL_COLOR, UPDATE_INITIAL_UNIFORMS,
    UPDATE_INITIAL_TRANSLATION, UPDATE_INITIAL_ROTATION,
    ADD_ANIMATION, ADD_SHADER_ANIMATION,
    CLEAN_ANIMATIONS, CLEAN_SHADER_ANIMATIONS,
    REMOVE_ANIMATION, REMOVE_SHADER_ANIMATION,
    UPDATE_ANIMATION, UPDATE_SHADER_ANIMATION,
} from '../constants/actionTypes'

export const updateInitialTranslation = translation => ({
    type: UPDATE_INITIAL_TRANSLATION,
    translation,
})

export const updateInitialScale = scale => ({
    type: UPDATE_INITIAL_SCALE,
    scale,
})

export const updateInitialColor = color => ({
    type: UPDATE_INITIAL_COLOR,
    color,
})

export const updateInitialRotation = rotation => ({
    type: UPDATE_INITIAL_ROTATION,
    rotation,
})

export const updateInitialUniforms = uniforms => ({
    type: UPDATE_INITIAL_UNIFORMS,
    uniforms,
})

export const addAnimation = animation => ({
    type: ADD_ANIMATION,
    animation,
})

export const removeAnimation = index => ({
    type: REMOVE_ANIMATION,
    index,
})

export const removeShaderAnimation = index => ({
    type: REMOVE_SHADER_ANIMATION,
    index,
})

export const updateAnimation = (index, newAnimation) => ({
    type: UPDATE_ANIMATION,
    newAnimation,
    index,
})

export const addShaderAnimation = shaderAnimation => ({
    type: ADD_SHADER_ANIMATION,
    shaderAnimation,
})

export const updateShaderAnimation = (index, shaderAnimation) => ({
    type: UPDATE_SHADER_ANIMATION,
    shaderAnimation,
    index,
})

export const cleanAnimations = () => ({
    type: CLEAN_ANIMATIONS,
})

export const cleanShaderAnimations = () => ({
    type: CLEAN_SHADER_ANIMATIONS,
})
