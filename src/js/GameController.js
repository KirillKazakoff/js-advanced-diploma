import Team from './Team';
import GamePlay from './GamePlay';
import gameState from './gameState';
import cursors from './cursors';


export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
    }

    init() {
        gameState.from({ turn: 'player', level: 2 });
        this.gamePlay.drawUi('prairie');
        this.gamePlay.redrawPositions(Team.teams);

        this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
        this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
        this.gamePlay.addCellClickListener((index) => this.onCellClick(index));

    }

    onCellEnter(index) {
        const cell = this.getCell(index);
        const charData = this.getChar(cell);
        const { activePos } = gameState;

        this.gamePlay.setCursor(cursors.pointer);

        if (charData) {
            if (cell.lastElementChild.className === 'tooltip') {
                GamePlay.showCellTooltip(cell);
            } else {
                const { level, attack, defence, health } = charData;
                const codes = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
                const [lPic, aPic, dPic, hPic] = codes;

                GamePlay.createToolTip(`${lPic} ${level} ${aPic} ${attack} ${dPic} ${defence} ${hPic} ${health}`, cell);
            }
        }

        if (!charData && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('moveRange', activePos);
            console.log(posObj.toMainDb);

            if (posObj.positions.some((position) => position === index)) {
                this.gamePlay.selectCell(index, 'green');
            }
        }

        if (charData.turn === 'AI' && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('attackRange', activePos);

            if (posObj.positions.some((position) => position === index)) {
                this.gamePlay.setCursor(cursors.crosshair);
                this.gamePlay.selectCell(index, 'red');
                return;
            }
            this.gamePlay.setCursor(cursors.notallowed);
        }

        if (charData.turn === 'AI' && typeof activePos !== 'number') {
            this.gamePlay.setCursor(cursors.notallowed);
        }
    }


    onCellLeave(index) {
        const cell = this.getCell(index);

        if (cell.title) {
            GamePlay.hideCellTooltip(cell);
        }
        if (cell.className.includes('green') || cell.className.includes('red')) {
            this.gamePlay.deselectCell(index);
        }
    }

    
    onCellClick(index) {
        let { activePos, turn } = gameState;
        const cell = this.getCell(index);
        const charData = this.getChar(cell);

        if (!charData && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('moveRange', activePos);

            if (posObj.positions.some((position) => position === index)) {
                this.clearDataset(activePos);
                Team.moveActiveChar(index);
                this.gamePlay.redrawPositions(Team.teams);

                this.gamePlay.deselectCell(index);
                this.gamePlay.selectCell(index, 'yellow');
                this.gamePlay.deselectCell(activePos);

                gameState.activePos = index;
                gameState.turn = turn === 'player' ? 'AI' : 'player';
            }
            return;
        }

        if (charData.turn !== "player" && typeof activePos === 'number') {
            const posObj = this.gamePlay.getPositions('attackRange', activePos);
            const activeChar = this.getChar(this.getCell(activePos));

            if (posObj.positions.some((position) => position === index)) {
                this.gamePlay.showDamage(index, activeChar.attack).then(() => {
                    const result = Team.attackChar(index);
                    if (result === 'killed') {
                        this.clearDataset(index);
                        this.gamePlay.deselectCell(index);
                    }
                    this.gamePlay.redrawPositions(Team.teams);
                });
                return;
            }
        }

        if (charData) {
            this.onPlayerCharClick(index);
            return;
        }
    }

    onPlayerCharClick(index) {
        const cell = this.getCell(index)
        const charData = this.getChar(cell);
        const { turn, position } = charData;
        let { activePos } = gameState;
        
        if (turn === 'AI') {
            alert('that is not character in your team');
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
        gameState.activePos = activePos;
    }

    // initAI() {
    //     SayHello.call(this);
    // }

    clearDataset(position) {
        const cell = this.getCell(position);
        delete cell.dataset.charData;
        cell.title = '';
    }

    getCell(index) {
        return this.gamePlay.cells[index];
    }

    getChar(cell) {
        try {
            return JSON.parse(cell.dataset.charData);
        }
        catch {
            return false;
        }
    }
}






