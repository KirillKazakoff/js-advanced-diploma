/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
// import Character from './classes/main';
// import closure from '../examples';

// const myClosure = closure;

// const sub = closure();
// const plus = closure();

// sub('-');
// sub('-');
// sub('-');
// console.log(plus('+'));
// console.log(sub('-'));

