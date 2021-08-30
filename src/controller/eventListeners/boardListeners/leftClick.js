import * as auxController from '../../js/auxController';

export function onCellLeftClick(event) {
    const { position } = event.target.closest('li').dataset;
    const { activePos, underControl } = gameState;
    const { characters, board, cardAI, cardPL } = this;

    const char = characters.getTeamChar(position);
    const activeChar = characters.getTeamChar(activePos);

    const onEmptyCellClick = (cellPos) => {
        const positions = activeChar.getMoveRange();

        if (positions.some((position) => position === cellPos)) {
            characters.moveChar(activeChar, cellPos);
            board.clearDataset(activePos);

            board.renderChars(characters.characters);

            board.deselectCell(cellPos);
            board.selectCell(cellPos, 'yellow');
            board.deselectCell(activePos);

            gameState.activePos = cellPos;
            auxController.turnAI();
        }
        return;
    }

    const onEnemyClick = (char) => {
        const positions = activeChar.getAttackRange();

        if (positions.some((position) => position === char.position) && underControl) {
            gameState.underControl = false;
            characters.fight(activeChar, char).then((isKilled) => {
                if (isKilled) {
                    board.clearDataset(char.position);
                    board.deselectCell(char.position);
                }
                board.renderChars(characters.characters)
                cardAI.showCharacter(char);
                auxController.turnAI();
            });;
        }
    }

    const onPlayerCharClick = (char) => {
        if (turn === 'AI') {
            cardAI.showCharacter(char);
            return;
        }

        board.selectCell(position);
        if (typeof activePos === 'number') {
            board.deselectCell(activePos);
        }
        if (activePos === position) {
            activePos = null;
            cardPL.showGeneric();
        } else {
            activePos = position;
            cardPL.showCharacter(char);
        }

        if (gameState.isCellHolded) {
            cardPL.showCharacter(char);
            board.selectCell(position, 'yellow');
            activePos = position;
            gameState.isCellHolded = false;
        }

        gameState.activePos = activePos;
    }


    if (!char && typeof activePos === 'number' && underControl) {
        onEmptyCellClick(position);
    }

    if (char.turn === 'AI' && typeof activePos === 'number') {
        onEnemyClick(char);
    }

    if (char) {
        onPlayerCharClick(char);
    }
}