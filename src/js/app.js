import gamePlay from './gamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

gameCtrl.init();
// don't write your code here
document.addEventListener('contextmenu', (event) => {
    // event.preventDefault();
})











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