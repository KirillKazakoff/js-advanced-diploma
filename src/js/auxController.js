import gamePlay from './gamePlay';
import gameState from './gameState';
import TeamLogicAI from './TeamLogicAI';
import TeamCommon from './TeamCommon';
import { generateChars, genPlayerReinforceProps, getPositionedChars } from './generators';

let teamAI;
let teamPl;

function refreshTeams() {
    teamAI = new TeamLogicAI(gamePlay.getTeam('AI'));
    teamPl = new TeamLogicAI(gamePlay.getTeam('player'));
}

function toNextLevel() {
    gameState.toNextLevel();
    gamePlay.boardEl.classList.add(gameState.theme);
    teamPl.levelUp();

    const { amount, level } = genPlayerReinforceProps();
    const reinforcement = generateChars(level, amount, 'player');
    teamPl.addChars(reinforcement);
    teamPl.characters = getPositionedChars(teamPl.characters);

    teamAI = new TeamLogicAI(generateChars(level + 1, teamPl.amount, 'AI'));
    gamePlay.teams = new TeamCommon(teamAI.characters, teamPl.characters);

    gamePlay.clearAllDataset();
    gamePlay.redrawPositions(gamePlay.teams.characters);
}

function endGame() {
    gamePlay.deselectAllCells();
    const board = document.querySelector('.board');
    board.innerHTML = board.innerHTML;
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

export function initTeams() {
    const charsPl = generateChars(1, 2, 'player');
    const charsAI = generateChars(1, 2, 'AI');

    gamePlay.teams = new TeamCommon(charsPl, charsAI);
    refreshTeams();
}
