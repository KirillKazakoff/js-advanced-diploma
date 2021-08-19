export function getHighestPropChar(prop, arr) {
    if (arr.length < 1) {
        return 0;
    }
    arr.sort((a, b) => b[prop] - a[prop]);
    return arr[0];
}

export function getLowestPropChar(prop, arr) {
    if (arr.length < 1) {
        return 0;
    }
    arr.sort((a, b) => a[prop] - b[prop]);
    return arr[0];
}

export function setify(iterable) {
    return [...new Set(iterable)];
}
