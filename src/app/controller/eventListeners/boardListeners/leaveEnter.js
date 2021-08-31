import state from "../../../state/state";

export function onCellLeave(cell) {
    if (cell.className.includes('green') || cell.className.includes('red')) {
        this.board.deselectCell(index);
    }
    if (state.isCellHolded) {
        this.board.onCellUp();
    }
}

export function onCellEnter(position) {
    const { activePos } = state;
    const { characters, board } = this;

    const char = characters.getTeamChar(position);
    const activeChar = characters.getTeamChar(activePos);

    board.setCursor('pointer');

    if (!char && typeof activePos === 'number') {
        const positions = activeChar.getMoveRange();

        if (positions.some((position) => position === position)) {
            board.selectCell(position, 'green');
        }
    }

    if (char.turn === 'AI' && typeof activePos === 'number') {
        const positions = activeChar.getAttackRange();

        if (positions.some((position) => position === position)) {
            board.setCursor('crosshair');
            board.selectCell(position, 'red');
            return;
        }
        board.setCursor('not-allowed');
    }

    if (char.turn === 'AI' && typeof activePos !== 'number') {
        board.setCursor('not-allowed');
    }
}


