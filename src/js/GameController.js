import gameState from './gameState';
import { turnAI, initTeams } from './auxController';
import testData from './classes/testData';

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
    }

    init() {
        gameState.toNextLevel();
        this.gamePlay.drawUi(gameState.theme);

        this.initTest();
        // initTeams();

        this.gamePlay.addNewGameListener(() => this.onNewGameClick());

        this.gamePlay.addCellDownListener((index) => this.onCellDown(index));
        this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
        this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
        this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
        this.gamePlay.addCellUpListener(() => this.onCellUp());
    }

    onNewGameClick() {
        gameState.newGameStart();
        this.gamePlay.drawUi(gameState.theme);
        initTeams();
    }

    onCellEnter(index) {
        const cell = this.getCell(index);
        const charData = this.getChar(cell);
        const { activePos } = gameState;

        this.gamePlay.setCursor('pointer');

        if (charData) {
            if (cell.lastElementChild.className === 'tooltip') {
                this.gamePlay.showCellTooltip(cell);
            } else {
                const {
                    level, attack, defence, health,
                } = charData;
                const codes = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
                const [lPic, aPic, dPic, hPic] = codes;

                this.gamePlay.createToolTip(`${lPic} ${level} ${aPic} ${attack} ${dPic} ${defence} ${hPic} ${health}`, cell);
            }
        }

        if (!charData && typeof activePos === 'number') {
            const positions = this.getMoveRange(activePos);

            if (positions.some((position) => position === index)) {
                this.gamePlay.selectCell(index, 'green');
            }
        }

        if (charData.turn === 'AI' && typeof activePos === 'number') {
            const positions = this.getAttackRange(activePos);

            if (positions.some((position) => position === index)) {
                this.gamePlay.setCursor('crosshair');
                this.gamePlay.selectCell(index, 'red');
                return;
            }
            this.gamePlay.setCursor('not-allowed');
        }

        if (charData.turn === 'AI' && typeof activePos !== 'number') {
            this.gamePlay.setCursor('not-allowed');
        }
    }

    onCellClick(index) {
        const { activePos, underControl } = gameState;
        const cell = this.getCell(index);
        const charData = this.getChar(cell);
        const { teams } = this.gamePlay;

        if (!charData && typeof activePos === 'number' && underControl) {
            const positions = this.getMoveRange(activePos);

            if (positions.some((position) => position === index)) {
                teams.moveActiveChar(index);
                this.gamePlay.redrawPositions(teams.characters);

                this.gamePlay.deselectCell(index);
                this.gamePlay.selectCell(index, 'yellow');
                this.gamePlay.deselectCell(activePos);

                gameState.activePos = index;
                turnAI();
            }
            return;
        }

        if (charData.turn !== 'player' && typeof activePos === 'number') {
            const positions = this.getAttackRange(activePos);

            if (positions.some((position) => position === index) && underControl) {
                gameState.underControl = false;
                teams.attackChar(index).then(() => {
                    turnAI();
                });
            }
        }

        if (charData) {
            this.onPlayerCharClick(index);
        }
    }




    onCellLeave(index) {
        const cell = this.getCell(index);

        if (cell.title) {
            this.gamePlay.hideCellTooltip(cell);
        }
        if (cell.className.includes('green') || cell.className.includes('red')) {
            this.gamePlay.deselectCell(index);
        }
        if (gameState.isCellHolded) {
            this.onCellUp();
        }
    }

    onCellDown(index) {
        const chardata = this.getChar(this.getCell(index));
        const { isRangeButton } = this.gamePlay;

        if (chardata) {
            this.highlightAttackRange(index, isRangeButton);
            this.highlightMoveRange(index, isRangeButton);
            gameState.isCellHolded = true;
        }
    }

    onCellUp() {
        if (gameState.underControl) {
            this.gamePlay.deselectAllCells();
            if (typeof gameState.activePos === 'number') {
                this.gamePlay.selectCell(gameState.activePos, 'yellow');
            }
        }
    }

    highlightAttackRange(index, toggled) {
        if (toggled) {
            const attackRange = this.getAttackRange(index);
            const resultRange = GameController.exceptChars(attackRange, index);

            resultRange.forEach((position) => this.gamePlay.selectCell(position, 'red'));
        }
    }

    highlightMoveRange(index, toggled) {
        if (!toggled) {
            const moveRange = this.getMoveRange(index);
            const resultRange = GameController.exceptChars(moveRange, index);

            resultRange.forEach((position) => this.gamePlay.selectCell(position, 'green'));
        }
    }

    static exceptChars(range, index) {
        return range.reduce((total, position) => {
            if (position !== index) {
                total.push(position);
            }
            return total;
        }, []);
    }

    onPlayerCharClick(index) {
        const cell = this.getCell(index);
        const charData = this.getChar(cell);
        const { turn, position } = charData;
        let { activePos } = gameState;

        if (turn === 'AI') {
            return;
        }

        this.gamePlay.selectCell(index);
        if (typeof activePos === 'number') {
            this.gamePlay.deselectCell(activePos);
        }
        if (activePos === position) {
            activePos = null;
        } else {
            activePos = position;
        }

        if (gameState.isCellHolded) {
            this.gamePlay.selectCell(index, 'yellow');
            activePos = position;
            gameState.isCellHolded = false;
        }
        gameState.activePos = activePos;
    }



    getMoveRange(index) {
        return this.gamePlay.getPositions('moveRange', index).positions;
    }

    getAttackRange(index) {
        return this.gamePlay.getPositions('attackRange', index).positions;
    }

    clearDataset(index) {
        this.gamePlay.clearDataset(index);
    }

    getCell(index) {
        return this.gamePlay.cells[index];
    }

    getChar(cell) {
        return this.gamePlay.getChar(cell);
    }

    initTest() {
        this.gamePlay.teams = testData;
        this.gamePlay.redrawPositions(this.gamePlay.teams.characters);
    }
}
