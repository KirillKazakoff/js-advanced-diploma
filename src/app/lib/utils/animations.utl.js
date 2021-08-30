export function getCellCoords(char) {
    const cell = char.getHtml();
    const coords = cell.getBoundingClientRect();

    let { top, left } = coords;
    top = top + pageYOffset;
    left = left + pageXOffset;

    const coordsObj = { top, left };
    return coordsObj;
}

export function getRotationDegree(attackerCoords, victimCoords) {
    const { left: attackerLeft, top: attackerTop } = attackerCoords;
    const { left: victimLeft, top: victimTop } = victimCoords;

    const a = Math.abs(attackerLeft - victimLeft);
    const b = Math.abs(attackerTop - victimTop);
    let degree = 0;

    if (b) {
        const c = Math.sqrt(a ** 2 + b ** 2);
        const cos = ((a ** 2) + (c ** 2) - (b ** 2)) / (2 * a * c);
        degree = Math.acos(cos) * 180 / Math.PI;
    }
    return degree;
}
