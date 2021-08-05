import Team from "./Team";
import TeamSeparate from "./TeamSeparate";

const teamAI = new TeamSeparate(Team.getTeam('AI'));
const teamPlayer = new TeamSeparate(Team.getTeam('player'));

// const defender = getHighestPropChar('defence', teamAI);
// const attacker = getHighestPropChar('attack', teamAI);
// const target = getLowestPropChar('defence', teamPlayer);

export default function turnAI() {
    
}



function chooseAttackPos() {
    const possiblePos = teamAI.calcPossibleAttackPos(teamPlayer);
    
}

