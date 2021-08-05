/**
 * Entry point of app: don't change this
 */
import gamePlay from './gamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
import turnAI from './logicAI';

turnAI();


