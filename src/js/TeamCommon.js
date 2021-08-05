import gameState from "./gameState";

export default class TeamCommon {
    constructor(...teams) {
        this.characters = teams.reduce((total, team) => {
            team.forEach((char) => total.push(char))
            return total;
        })
    }

    moveActiveChar(position) {
        const activeChar = this.getTeamChar(gameState.activePos);
        this.deleteChar(activeChar);

        activeChar.position = position;
        this.characters.push(activeChar);
    }

    attackChar(position) {
        const attacker = this.getTeamChar(gameState.activePos);
        const target = this.getTeamChar(position);

        target.health -= Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        if (target.health < 0) {
            this.deleteChar(target); 
            return 'killed';
        }
    }

    getTeamChar(position) {
        return this.characters.find((character) => character.position === position);
    }

    deleteChar(delChar) {
        const index = this.characters.findIndex((character) => character.position === delChar.position);
        this.characters.splice(index, 1);
    }

    getTeam(turn) {
        return this.characters.filter((character) => character.turn === turn);
    }
 }
