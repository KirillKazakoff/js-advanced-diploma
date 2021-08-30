import gameState from "../../../js/gameState";

export function onRangeSwitch(event) {
    if (event.key === 'r') {
        this.isRangeButton = !this.isRangeButton;
    }
}

export function onCellDown(event) {
    const { position } = event.target.closest('li').dataset;

    this.timer = setTimeout(() => {
        const { isRangeButton, teams } = this;
        const char = teams.getTeamChar(position);

        if (char) {
            highlightAttackRange(char, isRangeButton);
            highlightMoveRange(char, isRangeButton);
            gameState.isCellHolded = true;
        }
    }, 500);
}

export function onCellUp() {
    clearTimeout(this.timer);

    if (gameState.underControl) {
        board.deselectAllCells();
        if (typeof gameState.activePos === 'number') {
            board.selectCell(gameState.activePos, 'yellow');
        }
    }
}

function highlightAttackRange(char, toggled) {
    if (toggled) {
        const attackRange = char.getAttackRange();
        const resultRange = exceptChars(attackRange, char);

        resultRange.forEach((position) => board.selectCell(position, 'red'));
    }
}

function highlightMoveRange(char, toggled) {
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
















