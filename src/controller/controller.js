import * as auxController from './auxController';
import gameState from './gameState';

import board from '../components/board/board';
import { addBoardListeners } from './eventListeners/boardListeners/boardListeners';

export default {
    init(characters) {
        this.gameState = gameState;
        this.gameState.toNextLevel();

        this.characters = characters;

        this.board = board;
        this.board.getContainer('.board');
        board.renderBoard(gameState.theme, gameState.boardSize);
        board.renderChars(this.characters.heroes);
    },

    addListeners() {
        addBoardListeners.call(this);
        this.gamePlay.addMenuListener(auxController.onMenuClick);
        this.gamePlay.addLoadGameListener(() => auxController.onLoadGameClick());
        this.gamePlay.addSaveGameListener(() => auxController.onSaveGameClick());
        this.gamePlay.addNewGameListener(() => auxController.onNewGameClick());
    },

}
