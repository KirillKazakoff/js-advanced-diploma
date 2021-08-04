import gamePlay from "./gamePlay";
import Team from "./Team";
import TeamSeparate from "./TeamSeparate";

const teamAI = new TeamSeparate(Team.getTeam('AI'));
const teamPlayer = new TeamSeparate(Team.getTeam('player'));

const defender = teamAI.getHighestPropChar('defence');
const attacker = teamAI.getHighestPropChar('attack');
const target = teamPlayer.getLowestPropChar('defence');

export default function defenceChar() {
    const { positions: movePositions } = this.gamePlay.getPositions('moveRange', defender.position);
    const { positions: attackPositions } = this.gamePlay.getPositions('attackRange', defender.position);
    console.log(movePositions, attackPositions);
    console.log(teamPlayer.getAttackPositions());
}

// export default function test() {
//     console.log(gamePlay)
// }
