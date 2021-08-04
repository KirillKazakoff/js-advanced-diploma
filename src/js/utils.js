import gameState from "./gameState";

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

export function calcPossiblePositions(cellAmount) {
    const { activePos } = gameState;
    const { boardSize } = this.gamePlay;

    const positions = new Set();
    const toRight = []; 
    const toLeft = []; 
    const toTop = []; 
    const toBottom = []; 
    const toMainDb = []; 
    const toMainDt = []; 
    const toAuxDb = []; 
    const toAuxDt = []; 

    const calcToRight = () => {
        for (let i = 0; i < cellAmount + 1; i += 1) {
            const calcExp = activePos + i;
            const cell = this.getCell(calcExp);

            positions.add(calcExp);
            toRight.push(calcExp);
            if (cell.className.includes('right')) {
                return;
            }
        }
    }

    const calcToLeft = () => {
        for (let i = 0; i < cellAmount + 1; i += 1) {
            const calcExp = activePos - i;
            const cell = this.getCell(calcExp);

            positions.add(calcExp);
            toLeft.push(calcExp);
            if (cell.className.includes('left')) {
                return;
            }
        }
    }

    const calcToTop = () => {
        for (let i = 0; i < cellAmount + 1; i += 1) {
            const calcExp = activePos - i * boardSize;
            const cell = this.getCell(calcExp);

            positions.add(calcExp);
            toTop.push(calcExp);
            if (cell.className.includes('top')) {
                return;
            }
        }
    }

    const calcToBottom = () => {
        for (let i = 0; i < cellAmount + 1; i += 1) {
            const calcExp = activePos + i * boardSize;
            const cell = this.getCell(calcExp);

            positions.add(calcExp);
            toBottom.push(calcExp);
            if (cell.className.includes('bottom')) {
                return;
            }
        }
    }

    const calcToMainDiagTop = () => {
        if (this.getCell(activePos).className.includes('right')) {
            return;
        }

        for (let i = 1; i < cellAmount + 1; i += 1) {
            const calcExp = activePos - i * (boardSize - 1);
            if (calcExp < 0) {
                return;
            }

            const cell = this.getCell(calcExp);
            positions.add(calcExp);
            toMainDt.push(calcExp);
            if (!cell.className.includes('center')) {
                return;
            }
        }

    }

    const calcToMainDiagBottom = () => {
        if (this.getCell(activePos).className.includes('left')) {
            return;
        }
        
        for (let i = 1; i < cellAmount + 1; i += 1) {
            const calcExp = activePos + i * (boardSize - 1);
            if (calcExp >= boardSize ** 2) {
                return;
            }

            const cell = this.getCell(calcExp);
            positions.add(calcExp);
            toMainDb.push(calcExp);
            if (!cell.className.includes('center')) {
                return;
            }
        }

    }

    const calcToAuxDiagTop = () => {
        if (this.getCell(activePos).className.includes('left')) {
            return;
        }

        for (let i = 1; i < cellAmount + 1; i += 1) {
            const calcExp = activePos - i * (boardSize + 1);
            if (calcExp < 0) {
                return;
            }

            const cell = this.getCell(calcExp);
            
            positions.add(calcExp);
            toAuxDt.push(calcExp);
            if (!cell.className.includes('center')) {
                return;
            }
        }

    }

    const calcToAuxDiagBottom = () => {
        if (this.getCell(activePos).className.includes('right')) {
            return;
        }

        for (let i = 1; i < cellAmount + 1; i += 1) {
            const calcExp = activePos + i * (boardSize + 1);
            if (calcExp >= boardSize ** 2) {
                return;
            }

            const cell = this.getCell(calcExp);
            positions.add(calcExp);
            toAuxDb.push(calcExp);
            if (!cell.className.includes('center')) {
                return;
            }
        }

    }

    calcToRight();
    calcToLeft();
    calcToTop();
    calcToBottom();
    calcToMainDiagTop();
    calcToMainDiagBottom();
    calcToAuxDiagTop();
    calcToAuxDiagBottom();

    return {
        positions: [...positions],
        toRight, toLeft, toBottom, toTop,
        toMainDb, toMainDt, toAuxDb, toAuxDt,
    };
}

