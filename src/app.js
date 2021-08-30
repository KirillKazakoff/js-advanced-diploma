import controller from "./controller/controller";
import { initTestHeroes, initGameHeroes } from './controller/initHeroes';

window.onload = () => {
    gameCtrl.init(initTestHeroes());
    // don't write your code here

    const firstChar = gamePlay.teams.characters[0];
    const secondChar = gamePlay.teams.characters[2];

    firstChar.shot(secondChar);

    const skills = document.querySelector('.powershot');
    skills.addEventListener('click', () => console.log('hello'));
    console.log(skills);
}




