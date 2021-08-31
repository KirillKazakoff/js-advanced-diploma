import state from '../state/state';

import Menu from '../components/menu/menu';
import Card from '../components/card/card';
import Characters from '../logic/characters';
import Board from '../components/board/board';

import addBoardListeners from './eventListeners/boardListeners/boardListeners';
import addMenuListeners from './eventListeners/menuListeners/menuListeners';

export default class Controller {
    constructor() {
        this.container = document.querySelector('.game-container');
    }

    init() {
        state.toNextLevel();
        this.menu = new Menu();

        this.initCards();
        this.initCharacters();
        this.initBoard();
    }

    initCards() {
        this.cardAI = new Card('AI');
        this.cardPL = new Card('PL');
    }

    initCharacters() {
        this.characters = new Characters();
    }

    initBoard() {
        this.board = new Board();
        this.board.renderBoard(state.theme, state.boardSize);
        this.board.renderChars(this.characters.heroes);
    }


    addListeners() {
        addBoardListeners.call(this);
        addMenuListeners.call(this);
    }

    toNextLevel() {
        this.state.toNextLevel();
        this.characters.toNextLevel();
        this.board.setTheme(state.theme);
        this.board.clearAllDataset();
        this.board.renderChars(this.characters.heroes);
    }

    endGame() {
        state.getMaxPoints();
        this.board.deselectAllCells();
        this.board.clearListeners();
    }

    turnAI() {
        state.underControl = false;
        const { characters } = this;

        characters.refreshTeams();

        if (characters.teamAI.amount) {
            return characters.teamAI.makeDecisionAI(characters.teamPL).then(() => {
                state.underControl = true;
                characters.refreshTeams();

                if (characters.teamPL.amount) {
                    endGame();
                }
                return;
            });
        }
        toNextLevel();
    }

}
