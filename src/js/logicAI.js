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

    const decision = teamAI.decide(teamPl);
    console.log(decision);
    
    
}


function weakestStrategy() {
    const weakestPl = teamAI.getBestVictim(teamPl);
    const attacker = teamAI.getBestAttacker(weakestPl, teamPl);

    console.log(weakestPl);
    console.log(attacker);
}

function moveStrategy() {
    // find the most defended and move to fight with him
}

function isInAffectedArea(char, turn) {
    defineTeams(turn);
    const possiblePos = attackTeam.getAttackPos(defenceTeam);

    if (possiblePos.some((position) => position === char.position)) {
        return true;
    }
    return false;
}

function defineTeams(turn) {
    defenceTeam = turn === "player" ? teamPl : teamAI;
    attackTeam = turn === "player" ? teamAI : teamPl;
}



