import generateTeam from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';

const teamPlayer = generateTeam(2, 2, 'player');
const teamAI = generateTeam(2, 2, 'AI');

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
    }

    init() {
        GameState.from({ turn: 'player', level: 1 });
        this.gamePlay.drawUi('prairie');
        this.gamePlay.redrawPositions([...teamPlayer, ...teamAI]);

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
                console.log(charData);
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

        if (cell.firstElementChild) {
            const charData = JSON.parse(cell.dataset.charData);

            console.log(charData);
        }
    }
}
// const charEl = document.createElement('div');
// charEl.addEventListener('mouseenter');
