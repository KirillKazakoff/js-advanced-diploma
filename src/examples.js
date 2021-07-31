// /**
//  * Entry point of app: don't change this
//  */
// import GamePlay from './GamePlay';
// import GameController from './GameController';
// import GameStateService from './GameStateService';

// const gamePlay = new GamePlay();
// gamePlay.bindToDOM(document.querySelector('#game-container'));

// const stateService = new GameStateService(localStorage);

// const gameCtrl = new GameController(gamePlay, stateService);
// gameCtrl.init();

// // don't write your code here
// // import Character from './classes/main';
// let caller = {
//     callbacks: [],
//     pushCallback(callback) {
//         this.callbacks.push(callback);
//     }
// }

// let worker = {
//     a: 10,

//     sendCallback() {
//         caller.pushCallback(() => this.log());
//     },

//     log() {
//         console.log("Called with " + this.a);
//     },

//     log2() {
//         return () => this.log();
//     }
// };

// // worker.sendCallback();
// // const a = caller.callbacks[0];
// // console.log(a()); // return called with 10

// let bworker = {
//     a: 20,
//     log: worker.log,
//     thisLog: worker.log2,
//     workerLog: worker.log2(),
// }

// bworker.workerLog();
// bworker.thisLog()();
