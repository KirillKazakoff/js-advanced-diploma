export function calcTileType(index, boardSize) {
    const allCells = boardSize ** 2;

    if (index === 0) {
        return 'top-left';
    }
    if (index === boardSize - 1) {
        return 'top-right';
    }
    if (index < boardSize) {
        return 'top';
    }

    if (index === allCells - boardSize) {
        return 'bottom-left';
    }
    if (index === allCells - 1) {
        return 'bottom-right';
    }
    if (index >= allCells - boardSize) {
        return 'bottom';
    }

    if (index % boardSize === 0) {
        return 'left';
    }
    if ((index + 1) % boardSize === 0) {
        return 'right';
    }
    return 'center';
}

export function calcHealthLevel(health) {
    if (health < 15) {
        return 'critical';
    }
    if (health < 50) {
        return 'normal';
    }

    return 'high';
}

export function getRandomInt(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
}
