import gamePlay from "./gamePlay";

export function getMoveRange(position) {
    return gamePlay.getPositions('moveRange', position).positions;
    
}
export function getHighestPropChar(prop, arr) {
    arr.sort((a, b) => b[prop] - a[prop]);
    return arr[0];
}

export function getLowestPropChar(prop, arr) {
    arr.sort((a, b) => a[prop] - b[prop]);
    return arr[0];
}

export function setify(iterable) {
    return [...new Set(iterable)];
}