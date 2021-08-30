import state from '../state/state';

import Characters from '../logic/characters';
import Board from '../components/board/board';
import Card from '../components/card/card';
import { addBoardListeners } from './eventListeners/boardListeners/boardListeners';

export default class Controller{
    constructor() {
        this.container = document.querySelector('.game-container');
    }

    init() {
        this.initState();
        this.initCards();
        this.initCharacters();
        this.initBoard();
    }

    initState() {
        this.state = state;
        this.state.toNextLevel();
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
        // this.gamePlay.addMenuListener(auxController.onMenuClick);
        // this.gamePlay.addLoadGameListener(() => auxController.onLoadGameClick());
        // this.gamePlay.addSaveGameListener(() => auxController.onSaveGameClick());
        // this.gamePlay.addNewGameListener(() => auxController.onNewGameClick());
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
        this.characters.refreshTeams();

        if (this.characters.teamAI.amount) {
            return teamAI.makeDecisionAI(this.characters.teamPL).then(() => {
                state.underControl = true;
                this.characters.refreshTeams();

                if (!this.characters.teamPL.amount) {
                    endGame();
                }
                return;
            });
        }
        toNextLevel();
    }

}
