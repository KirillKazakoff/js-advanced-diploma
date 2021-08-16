import gameState from './gameState';
import * as auxController from './auxController';
import testData from './classes/testData';

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
    }

    init() {
        auxController.onFirstInit();
        // this.initTest();

        this.gamePlay.addLoadGameListener(() => auxController.onLoadClick());
        this.gamePlay.addSaveGameListener(() => auxController.onSaveGameClick());
        this.gamePlay.addNewGameListener(() => auxController.onNewGameClick());

        this.gamePlay.addCellDownListener((index) => this.onCellDown(index));
        this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
        this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
        this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
        this.gamePlay.addCellUpListener(() => this.onCellUp());
    }


    onCellEnter(index) {
        const cell = this.getCell(index);
        const { activePos } = gameState;
        const { teams } = this.gamePlay;
        const char = teams.getTeamChar(index);

        this.gamePlay.setCursor('pointer');

        if (char) {
            if (cell.lastElementChild.className === 'tooltip') {
                this.gamePlay.showCellTooltip(cell);
            } else {
                const {
                    level, attack, defence, health,
                } = char;
                const codes = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
                const [lPic, aPic, dPic, hPic] = codes;

                this.gamePlay.createToolTip(`${lPic} ${level} ${aPic} ${attack} ${dPic} ${defence} ${hPic} ${health}`, cell);
            }
        }

        if (!char && typeof activePos === 'number') {
            const positions = this.getMoveRange(activePos);

            if (positions.some((position) => position === index)) {
                this.gamePlay.selectCell(index, 'green');
            }
        }

        if (char.turn === 'AI' && typeof activePos === 'number') {
            const positions = this.getAttackRange(activePos);

            if (positions.some((position) => position === index)) {
                this.gamePlay.setCursor('crosshair');
                this.gamePlay.selectCell(index, 'red');
                return;
            }
            this.gamePlay.setCursor('not-allowed');
        }

        if (char.turn === 'AI' && typeof activePos !== 'number') {
            this.gamePlay.setCursor('not-allowed');
        }
    }

    onCellClick(index) {
        const { activePos, underControl } = gameState;
        const { teams } = this.gamePlay;
        const char = teams.getTeamChar(index);

        if (!char && typeof activePos === 'number' && underControl) {
            const positions = this.getMoveRange(activePos);

            if (positions.some((position) => position === index)) {
                teams.moveActiveChar(index);
                this.gamePlay.redrawPositions(teams.characters);

                this.gamePlay.deselectCell(index);
                this.gamePlay.selectCell(index, 'yellow');
                this.gamePlay.deselectCell(activePos);

                gameState.activePos = index;
                auxController.turnAI();
            }
            return;
        }

        if (char.turn !== 'player' && typeof activePos === 'number') {
            const positions = this.getAttackRange(activePos);

            if (positions.some((position) => position === index) && underControl) {
                gameState.underControl = false;
                teams.attackChar(index).then(() => {
                    auxController.turnAI();
                });
            }
        }

        if (char) {
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
        const { isRangeButton, teams } = this.gamePlay;
        const char = teams.getTeamChar(index);

        if (char) {
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
        const { teams } = this.gamePlay;
        const char = teams.getTeamChar(index);
        const { turn, position } = char;
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

    getCell(index) {
        return this.gamePlay.cells[index];
    }

    initTest() {
        gameState.toNextLevel();
        this.gamePlay.teams = testData;
        this.gamePlay.drawUi(gameState.theme);

        this.gamePlay.redrawPositions(this.gamePlay.teams.characters);
    }
}
