'use strict';

function isEmpty(value) {
    return [null, undefined, ""].indexOf(value) !== -1;
}

function convertToEmptyStringIfEmpty(value) {
    return isEmpty(value) ? "" : value;
}

module.exports = {
    isEmpty : isEmpty,
    toEmpty : convertToEmptyStringIfEmpty
};