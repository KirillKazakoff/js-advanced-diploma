import gamePlay from './gamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);

window.onload = () => {
    gameCtrl.init();
    // don't write your code here

    const firstChar = gamePlay.teams.characters[0];
    const secondChar = gamePlay.teams.characters[2];

    firstChar.shot(secondChar);

    const skills = document.querySelector('.powershot');
    skills.addEventListener('click', () => console.log('hello'));
    console.log(skills);
}
    



