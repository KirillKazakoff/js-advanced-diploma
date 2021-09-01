import state from "../../../state/state";

export function onRangeSwitch(event) {
    if (event.key === 'r') {
        this.isRangeButton = !this.isRangeButton;
    }
}

export function onCellDown(event) {
    const position = +event.target.closest('li').dataset.position;

    this.timer = setTimeout(() => {
        const { isRangeButton, characters, board } = this;
        const char = characters.getTeamChar(position);

        if (char) {
            highlightAttackRange(char, isRangeButton, board);
            highlightMoveRange(char, isRangeButton, board);
            state.isCellHolded = true;
        }
    }, 500);
}

export function onCellUp() {
    clearTimeout(this.timer);
    const { board } = this;

    if (state.underControl) {
        board.deselectAllCells();
        if (typeof state.activePos === 'number') {
            board.selectCell(state.activePos, 'yellow');
        }
    }
}

function highlightAttackRange(char, toggled, board) {
    if (toggled) {
        const attackRange = char.getAttackRange();
        const resultRange = exceptChars(attackRange, char);

        resultRange.forEach((position) => board.selectCell(position, 'red'));
    }
}

function highlightMoveRange(char, toggled, board) {
    if (!toggled) {
        const moveRange = char.getMoveRange();
        const resultRange = exceptChars(moveRange, char);

        resultRange.forEach((position) => board.selectCell(position, 'green'));
    }
}

function exceptChars(range, char) {
    return range.reduce((total, position) => {
        if (position !== char.position) {
            total.push(position);
        }
        return total;
    }, []);
}


// export function getCell(position) {
//     return document.querySelector(`[data-position="${position}"]`);
// }


// import state from "../../state/state";

// export default function getPositions(cellAmount, start) {
//     const { boardSize } = state;
//     const positions = new Set();
//     const toRight = [];
//     const toLeft = [];
//     const toTop = [];
//     const toBottom = [];
//     const toMainDb = [];
//     const toMainDt = [];
//     const toAuxDb = [];
//     const toAuxDt = [];

//     const calcToRight = () => {
//         for (let i = 0; i < cellAmount + 1; i += 1) {
//             const calcExp = start + i;
//             const cell = this.cells[calcExp];

//             positions.add(calcExp);
//             toRight.push(calcExp);
//             if (cell.className.includes('right')) {
//                 return;
//             }
//         }
//     };

//     const calcToLeft = () => {
//         for (let i = 0; i < cellAmount + 1; i += 1) {
//             const calcExp = start - i;
//             const cell = this.cells[calcExp];

//             positions.add(calcExp);
//             toLeft.push(calcExp);
//             if (cell.className.includes('left')) {
//                 return;
//             }
//         }
//     };

//     const calcToTop = () => {
//         for (let i = 0; i < cellAmount + 1; i += 1) {
//             const calcExp = start - i * boardSize;
//             const cell = this.cells[calcExp];

//             positions.add(calcExp);
//             toTop.push(calcExp);
//             if (cell.className.includes('top')) {
//                 return;
//             }
//         }
//     };

//     const calcToBottom = () => {
//         for (let i = 0; i < cellAmount + 1; i += 1) {
//             const calcExp = start + i * boardSize;
//             const cell = this.cells[calcExp];

//             positions.add(calcExp);
//             toBottom.push(calcExp);
//             if (cell.className.includes('bottom')) {
//                 return;
//             }
//         }
//     };

//     const calcToMainDiagTop = () => {
//         if (this.cells[start].className.includes('right')) {
//             return;
//         }

//         for (let i = 1; i < cellAmount + 1; i += 1) {
//             const calcExp = start - i * (boardSize - 1);
//             if (calcExp < 0) {
//                 return;
//             }

//             const cell = this.cells[calcExp];
//             positions.add(calcExp);
//             toMainDt.push(calcExp);
//             if (!cell.className.includes('center')) {
//                 return;
//             }
//         }
//     };

//     const calcToMainDiagBottom = () => {
//         if (this.cells[start].className.includes('left')) {
//             return;
//         }

//         for (let i = 1; i < cellAmount + 1; i += 1) {
//             const calcExp = start + i * (boardSize - 1);
//             if (calcExp >= boardSize ** 2) {
//                 return;
//             }

//             const cell = this.cells[calcExp];
//             positions.add(calcExp);
//             toMainDb.push(calcExp);
//             if (!cell.className.includes('center')) {
//                 return;
//             }
//         }
//     };

//     const calcToAuxDiagTop = () => {
//         if (this.cells[start].className.includes('left')) {
//             return;
//         }

//         for (let i = 1; i < cellAmount + 1; i += 1) {
//             const calcExp = start - i * (boardSize + 1);
//             if (calcExp < 0) {
//                 return;
//             }

//             const cell = this.cells[calcExp];
//             positions.add(calcExp);
//             toAuxDt.push(calcExp);
//             if (!cell.className.includes('center')) {
//                 return;
//             }
//         }
//     };

//     const calcToAuxDiagBottom = () => {
//         if (this.cells[start].className.includes('right')) {
//             return;
//         }

//         for (let i = 1; i < cellAmount + 1; i += 1) {
//             const calcExp = start + i * (boardSize + 1);
//             if (calcExp >= boardSize ** 2) {
//                 return;
//             }

//             const cell = this.cells[calcExp];
//             positions.add(calcExp);
//             toAuxDb.push(calcExp);
//             if (!cell.className.includes('center')) {
//                 return;
//             }
//         }
//     };

//     calcToRight();
//     calcToLeft();
//     calcToTop();
//     calcToBottom();
//     calcToMainDiagTop();
//     calcToMainDiagBottom();
//     calcToAuxDiagTop();
//     calcToAuxDiagBottom();

//     return {
//         positions: [...positions],
//         toRight,
//         toLeft,
//         toBottom,
//         toTop,
//         toMainDb,
//         toMainDt,
//         toAuxDb,
//         toAuxDt,
//     };
// }












