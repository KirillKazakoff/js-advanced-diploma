import gamePlay from './gamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();


// don't write your code here
// async function hello() {
//     let a = null;
//     const promise = new Promise((resolve) => {
//         setTimeout(() => {
//             a = 11, 2000;
//             resolve();
//         });
//     })
//     await promise;
//     return a;
// }

// hello().then((response) => console.log(response));