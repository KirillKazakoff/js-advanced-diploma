import gamePlay from './gamePlay';
import gameState from './gameState';
import TeamLogicAI from './TeamLogicAI';
import TeamCommon from './TeamCommon';
import * as generators from './generators';

let teamAI;
let teamPl;

function toNextLevel() {
    gameState.toNextLevel();
    gamePlay.pickTheme(gameState.theme);
    teamPl.levelUp();

    const { amount, level } = generators.genPlayerReinforceProps();
    const reinforcement = generators.generateChars(level, amount, 'player');
    teamPl.addChars(reinforcement);
    teamPl.characters = generators.getPositionedChars(teamPl.characters);

    teamAI = new TeamLogicAI(generators.generateChars(level + 1, teamPl.amount, 'AI'));
    gamePlay.teams = new TeamCommon(teamAI.characters, teamPl.characters);

    gamePlay.clearAllDataset();
    gamePlay.redrawPositions(gamePlay.teams.characters);
}

function endGame() {
    const board = document.querySelector('.board');

    gameState.getMaxPoints();
    gamePlay.deselectAllCells();
    board.innerHTML = board.innerHTML;
}

function refreshTeams() {
    gamePlay.refreshTeams();
    teamAI = gamePlay.teamAI;
    teamPl = gamePlay.teamPl;
}


export function turnAI() {
    gameState.underControl = false;
    refreshTeams();

    if (teamAI.amount) {
        return teamAI.makeDecisionAI(teamPl).then(() => {
            gameState.underControl = true;
            refreshTeams();

            if (!teamPl.amount) {
                endGame();
            }
            return;
        });
    }
    toNextLevel();
}



function initTeams() {
    const charsPl = generators.generateChars(1, 2, 'player');
    const charsAI = generators.generateChars(1, 2, 'AI');

    gamePlay.teams = new TeamCommon(charsPl, charsAI);
    gamePlay.redrawPositions(gamePlay.teams.characters);
    refreshTeams();
}

export function onFirstInit() {
    gameState.toNextLevel();
    gamePlay.drawUi(gameState.theme);
    initTeams();
}

export function onSaveGameClick() {
    const { characters } = gamePlay.teams;
    gameState.save(characters);
}

export function onNewGameClick() {
    gameState.newGameStart();
    gamePlay.drawUi(gameState.theme);
    initTeams();
}

export function onLoadClick() {
    const loadedChars = gameState.load();
    const classifiedChars = generators.recreateLoadedChars(loadedChars);
    console.log(classifiedChars);

    gamePlay.drawUi(gameState.theme);
    gamePlay.teams.characters = classifiedChars;
    gamePlay.redrawPositions(classifiedChars);

    const { activePos } = gameState;
    if (activePos) {
        gamePlay.selectCell(gameState.activePos);
    }
    refreshTeams();
}

export function onMenuClick(event) {
    const { target } = event;
    const menu = target.parentElement;
    const btnList = menu.querySelector('.menu-buttons');

    btnList.classList.toggle('buttons-active');
}