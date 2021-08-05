import Team from "./Team";
import gamePlay from "./gamePlay";

// const defender = getHighestPropChar('defence', teamAI);
// const attacker = getHighestPropChar('attack', teamAI);
// const target = getLowestPropChar('defence', teamPlayer);
let teamAI, teamPl;
let attackTeam, defenceTeam;

export default function turnAI() {
    teamAI = new Team(gamePlay.getTeam('AI'));
    teamPl = new Team(gamePlay.getTeam('player'));

    const weakestPl = getWeakestCharInWarZone('player');
    const weakestAI = getWeakestCharInWarZone('AI');

    console.log(weakestAI);
    console.log(weakestPl);
    console.log(teamAI.calcPossibleAttackPos(teamPl));
}

function getWeakestCharInWarZone(turn) {
    defineTeams(turn);
    const possiblePos = attackTeam.getPossibleAttackPos(defenceTeam);
    const possibleChars = defenceTeam.getChars(possiblePos);

    return getLowestPropChar('defence', possibleChars);
}

function isInAffectedArea(char, turn) {
    defineTeams(turn);
    const possiblePos = attackTeam.getPossibleAttackPos(defenceTeam);

    if (possiblePos.some((position) => position === char.position)) {
        return true;
    }
    return false;
}

function defineTeams(turn) {
    defenceTeam = turn === "player" ? teamPl : teamAI;
    attackTeam = turn === "player" ? teamAI : teamPl;
}

function getHighestPropChar(prop, arr) {
    arr.sort((a, b) => b[prop] - a[prop]);
    return arr[0];
}

function getLowestPropChar(prop, arr) {
    arr.sort((a, b) => a[prop] - b[prop]);
    return arr[0];
}

