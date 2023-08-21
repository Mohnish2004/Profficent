import badWords from "bad-words";

const filter = new badWords();

/**
 * @typedef {Object} CallbackSet - Set of callbacks to use when a validator succeeds or fails
 * @property {function} [onValid] Function that is run on valid values
 * @property {function} [onInvalid] Function that is run on invalid values
 */

/**
 * @typedef {function} Validator - Function that takes in a value and returns whether it is valid
 * @param {string} val Value to validate
 * @returns {boolean} Whether it is valid
 */

/**
 * @type {Validator}
 * @returns {boolean}
 */
export function isNumber(val) {
    return !isNaN(Number(val));
}

/**
 * @type {Validator}
 * @returns {boolean}
 */
export function isPositive(val) {
    return isNumber(val) && Number(val) >= 0;
}

/**
 * @type {Validator}
 * @returns {boolean}
 */
export function notBlank(val) {
    return val.length > 0;
}

/**
 * @property {number} num Number to test divisibility by
 * @returns {Validator} Returns a validator that determines whether a value is a number divisible by the argument
 */
export function isDivisibleBy(num) {
    return val => isNumber(val) && Number(val) % num === 0;
}

/**
 * @property {number} num Number to test greater than by
 * @returns {Validator} Returns a validator that determines whether a value is a number greater than the argument
 */
export function isGreaterThan(num) {
    return val => isNumber(val) && Number(val) > num;
}

/**
 * @property {number} num Number to test greater than by
 * @returns {Validator} Returns a validator that determines whether a value is a number greater than the argument
 */
export function isLessThan(num) {
    return val => isNumber(val) && Number(val) < num;
}

export function wordLen(val) {
    if(!val.trim().length) { return 0; }
    return (val.trim().match(/[^\s.?!,]+/g) || []).length;
}

/**
 * @property {number} num Text length timit
 * @returns {Validator} Returns a validator that determines whether a string is not longer than the argument
 */
export function isNotLongerThan(num) {
    return val => wordLen(val) <= num;
}

/**
 * @type {Validator}
 * @returns {boolean}
 */
export function noBadWords(val) {
    return !filter.isProfane(val);
}

/**
 * Combines validators
 * @param {function[]} validators Array of validators that take in a value and return true or false
 * @returns {function} A single validator combining the array of them
 */
export function combineValidators(validators) {
    if(validators.length === 1) { return validators[0]; }

    return val => {
        for(const validator of validators) {
            if(!validator(val)) { return false; }
        }
        return true;
    };
}