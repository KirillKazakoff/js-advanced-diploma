import state from '../state/state';

import Menu from '../components/menu/menu';
import Card from '../components/card/card';
import Characters from '../logic/characters';
import Team from '../logic/team';
import Board from '../components/board/board';

import addBoardListeners from './eventListeners/boardListeners/boardListeners';
import addMenuListeners from './eventListeners/menuListeners/menuListeners';

import { generateChars, genPlayerReinforceProps, getPositionedChars } from '../logic/charGen';
import { initTestAI, initTestPL, initAI, initPL } from '../logic/initTest';

export default class Controller {
    constructor() {
        this.isRangeButton = false;
        this.container = document.querySelector('.game-container');
    }

    init() {
        state.toNextLevel();
        this.menu = new Menu();

        this.initCards();
        this.initCharacters();
        this.initBoard();

        this.addListeners();
    }

    initCards() {
        this.cardAI = new Card('AI');
        this.cardPL = new Card('PL');
    }

    initCharacters() {
        // const charsAI = generateChars(1, 2, 'AI');
        // const charsPL = generateChars(1, 2, 'PL');
        this.teamAI = new Team(initTestAI);
        this.teamPL = new Team(initTestPL);
        this.characters = new Characters(this.teamAI.heroes, this.teamPL.heroes);
    }

    initBoard() {
        this.board = new Board();
        this.board.renderBoard(state.theme, state.boardSize);
        this.board.renderChars([...this.teamAI.heroes, ...this.teamPL.heroes]);
    }


    addListeners() {
        addBoardListeners.call(this);
        addMenuListeners.call(this);
    }

    updateCharacters() {
        this.characters.heroes = [...this.teamAI.heroes, ...this.teamPL.heroes]
    }

    toNextLevel() {
        const { board, teamAI, teamPL } = this;
        state.toNextLevel();
        teamPL.levelUp();

        const { amount, level } = genPlayerReinforceProps();
        const reinforcement = generateChars(level, amount, 'PL');
        teamPL.addChars(reinforcement);

        teamAI.addChars(generateChars(level + 1, teamPL.amount, 'AI'));
        teamPL.heroes = getPositionedChars(teamPL.heroes);

        board.setTheme(state.theme);
        board.clearAllDataset();
        board.renderChars([...teamAI.heroes, ...teamPL.heroes]);
        this.updateCharacters();
    }

    endGame() {
        state.getMaxPoints();
        this.board.deselectAllCells();
        this.board.clearListeners();
    }

    checkActivePos() {
        if (!state.activePos) {
            this.board.deselectAllCells();
        }
    }

    turnAI() {
        console.log(this.characters);
        state.underControl = false;
        const { teamAI, teamPL } = this;

        if (teamAI.amount) {
            return teamAI.makeDecisionAI(teamPL).then(() => {
                state.underControl = true;
                this.updateCharacters();
                this.checkActivePos();

                this.board.renderChars(this.characters.heroes);

                if (!teamPL.amount) {
                    this.endGame();
                }
                return;
            });
        }
        this.toNextLevel();
    }

}
