import gamePlay from "./gamePlay";
import gameState from "./gameState";

export function getMoveRange(position) {
    return gamePlay.getPositions('moveRange', position).positions;
}

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

export function attackFinally(attackerPos, victimPos) {
    gameState.activePos = attackerPos;
    gamePlay.teams.attackChar(victimPos);
}