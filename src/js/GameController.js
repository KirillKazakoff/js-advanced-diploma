import Team from './Team';
import GamePlay from './GamePlay';
import gameState from './gameState';
import { calcPossiblePositions } from './utils';

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
        const cell = this.getCell(index)

        if (cell.lastElementChild) {
            if (cell.lastElementChild.className === 'tooltip') {
                GamePlay.showCellTooltip(cell);
            } else {
                const charData = this.getChar(cell);
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
        const cell = this.getCell(index);

        if (cell.title) {
            GamePlay.hideCellTooltip(cell);
        }
    }

    clearActiveDataset() {
        const activeCell = this.getCell(gameState.activePos);
        delete activeCell.dataset.charData;
        activeCell.title = '';
    }

    onCharClick(index) {
        const cell = this.getCell(index)
        const charData = this.getChar(cell);
        const { turn, position } = charData;
        let { activePos } = gameState;

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
    }

    onCellClick(index) {
        let { activePos, turn } = gameState;
        const activeCell = this.getCell(activePos);
        const cell = this.getCell(index);

        if (!cell.lastElementChild && typeof activePos === 'number') {
            const charData = this.getChar(activeCell);
            this.clearActiveDataset();
            console.log(calcPossiblePositions.call(this, charData.moveRange));

            Team.moveActiveChar(index);
            this.gamePlay.redrawPositions(Team.teams);
            gameState.turn = turn === 'player' ? 'AI' : 'player';
        }

        if (cell.lastElementChild) {
            this.onCharClick(index);
        }

    }

    getCell(index) {
        return this.gamePlay.cells[index];
    }

    getChar(cell) {
        return JSON.parse(cell.dataset.charData);
    }
}
















// function calcPossiblePositions(cellAmount) {
//     const { activePos } = gameState;
//     const posArray = new Set();

//     for (let i = 0; i < cellAmount + 1; i += 1) {
//         const cell = this.getCell(activePos + i);

//         posArray.add(activePos + i);
//         if (cell.className.includes('right')) {
//             break;
//         }
//     }

//     for (let i = 0; i < cellAmount + 1; i += 1) {
//         const cell = this.getCell(activePos + i);

//         posArray.add(activePos - i);
//         if (cell.className.includes('left')) {
//             break;
//         }
//     }

//     return posArray;
// }
