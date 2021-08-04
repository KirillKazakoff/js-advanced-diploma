import generateTeam from "./generators";
import gameState from "./gameState";

const teamPlayer = generateTeam(2, 3, 'player');
const teamAI = generateTeam(2, 3, 'AI');
const teams = [...teamPlayer, ...teamAI];

export default {
    teams, 

    moveActiveChar(position) {
        const activeChar = this.getTeamChar(gameState.activePos);
        this.deleteChar(activeChar);

        activeChar.position = position;
        teams.push(activeChar);
    },

    attackChar(position) {
        const attacker = this.getTeamChar(gameState.activePos);
        const target = this.getTeamChar(position);

        target.health -= Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        if (target.health < 0) {
            this.deleteChar(target); 
            return 'killed';
        }
    },

    getTeamChar(position) {
        return teams.find((character) => character.position === position);
    },

    deleteChar(delChar) {
        const index = teams.findIndex((character) => character.position === delChar.position);
        teams.splice(index, 1);
    },

    getTeam(turn) {
        return teams.filter((character) => character.turn === turn);
    }
 }
