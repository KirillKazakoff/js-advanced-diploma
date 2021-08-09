import gamePlay from './gamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';
import TeamLogicAI from './TeamLogicAI';

gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here

const teamAI = new TeamLogicAI(gamePlay.getTeam('AI'));
const teamPl = new TeamLogicAI(gamePlay.getTeam('player'));

const acceptablePos = teamAI.getAcceptableZone(teamPl, 6);
console.log(acceptablePos);