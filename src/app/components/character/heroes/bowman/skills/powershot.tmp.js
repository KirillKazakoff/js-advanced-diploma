const powershotT = (attackerCoords) => ({
    block: 'div',
    cls: 'powershot',
    content: '',
    style: {
        'left': `${attackerCoords.left}px`,
        'top': `${attackerCoords.top}px`,
    }
})

export default powershotT;