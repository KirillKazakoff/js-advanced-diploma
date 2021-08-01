import Team from './Team';
import GamePlay from './GamePlay';
import gameState from './gameState';

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


        // TODO: add event listeners to gamePlay events
        // TODO: load saved stated from stateService
    }

    onCellEnter(index) {
        const cell = this.gamePlay.cells[index];

        if (cell.firstElementChild) {
            if (cell.title) {
                GamePlay.showCellTooltip(cell);
            } else {
                const charData = JSON.parse(cell.dataset.charData);
                const {
                    level, attack, defence, health,
                } = charData;
                const codes = ['0x1f396', '0x2694', '0x1f6e1', '0x2764'].map((code) => String.fromCodePoint(code));
                const [lPic, aPic, dPic, hPic] = codes;

                GamePlay.createToolTip(`${lPic} ${level} ${aPic} ${attack} ${dPic} ${defence} ${hPic} ${health}`, cell);
            }
        }
    }

    onCellLeave(index) {
        const cell = this.gamePlay.cells[index];

        if (cell.title) {
            GamePlay.hideCellTooltip(cell);
        }
    }

    onCellClick(index) {
        const cell = this.gamePlay.cells[index];
        let { activePos } = gameState;

        if (!cell.firstElementChild && gameState.activePos) {
            const activeCell = this.gamePlay.cells[activePos];
            const charData = JSON.parse(activeCell.dataset.charData);

            charData.position = index;   
            activeCell.dataset.charData = null;
            cell.dataset.charData = charData;

            this.gamePlay.redrawPositions(teams)
        }

        if (cell.firstElementChild) {
            const charData = JSON.parse(cell.dataset.charData);
            const { turn, position } = charData;

            if (turn === 'AI') {
                GamePlay.showError('that is not character in your team');
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
            console.log(gameState)
        }
        

    }
}
// const charEl = document.createElement('div');
// charEl.addEventListener('mouseenter');
