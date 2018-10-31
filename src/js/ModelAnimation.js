import { vec3 } from 'gl-matrix'
import BezierEasing from 'bezier-easing'

const defaultOpts = {
    target: 1.0,
    duration: 1.5,
    delay: 0.0,
    ease: 'linear'
}

const easings = {
    'linear': BezierEasing(1, 1, 1, 1),
    'ease': BezierEasing(0.25, 0.1, 0.25, 1),
    'ease-in': BezierEasing(0.42, 0, 1, 1),
    'ease-out': BezierEasing(0, 0, 0.58, 1),
    'ease-in-out': BezierEasing(0.42, 0, 0.58, 1),
}

/**
 * For animating uniform material values or transform properties
 */
class ModelAnimation {
    constructor(obj, propName, type, opts = defaultOpts) {
        this.time = 0
        this.isComplete = false
        this.isPlaying = false
        if (typeof opts.ease === 'string') {
            if (opts.ease in easings) {
                opts.easing = easings[opts.ease]
            } else {
                throw new TypeError(`opts.ease must be one of ${Object.keys(easings)}`)
            }
        } else if (Array.isArray(opts.ease) && opts.ease.length === 4) {
            opts.easing = BezierEasing(...opts.ease)
        } else {
            throw new TypeError('opts.ease must be a string or an Array(4)')
        }
        this.opts = opts
        switch(type) {
            case 'vec3':
                if (!Array.isArray(opts.target)) {
                    throw new TypeError('target value and obj[propName] must be the same type')
                }
                this.init = () => {
                    this.originalValue = obj[propName]
                    // The movement for each component
                    this.deltaMovement = opts.target.map((t, i) => t - obj[propName][i])
                }
                this.anim = (fract) => {
                    obj[propName] = this.deltaMovement.map((dm, i) => this.originalValue[i] + dm * fract)
                }
                break
            case 'float':
            default:
                if (typeof opts.target !== 'number') {
                    throw new TypeError('target value and obj[propName] must be the same type')
                }
                this.init = () => {
                    this.originalValue = obj[propName]
                    // movement every animation unit
                    this.deltaMovement = opts.target - obj[propName]
                }
                this.anim = (fract) => {
                    obj[propName] = this.originalValue + this.deltaMovement * fract
                }
                break
        }
    }

    update(dt) {
        const { duration, delay, easing } = this.opts
        this.time += dt // in seconds
        if (this.time < delay || this.isComplete) {
            return
        } else if (!this.isPlaying && !this.isComplete) {
            this.isPlaying = true
            this.init()
        }
        if (this.isPlaying && (this.time - delay) > duration) {
            this.anim(1)
            this.isComplete = true
            this.isPlaying = false
        } else {
            this.anim(easing((this.time - delay) / duration))
        }
    }
}

export default ModelAnimation
