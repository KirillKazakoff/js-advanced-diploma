import generateTeam from "./generators";
import gameState from "./gameState";

const teamPlayer = generateTeam(2, 2, 'player');
const teamAI = generateTeam(2, 2, 'AI');
const teams = [...teamPlayer, ...teamAI];

export default {
    teams,
    moveActiveChar(position) {
        const activeIndex = teams.findIndex((character) => character.position === gameState.activePos);
        const activeChar = teams.splice(activeIndex, 1)[0];
        
        activeChar.position = position;
        teams.push(activeChar);
    }
}
