import gameState from "./gameState";
import gamePlay from "./gamePlay";

export default class TeamCommon {
    constructor(...teams) {
        this.characters = teams.reduce((total, team) => {
            team.forEach((char) => total.push(char))
            return total;
        })
    }

    moveActiveChar(position) {
        gamePlay.clearDataset(gameState.activePos);
        const activeChar = this.getTeamChar(gameState.activePos);
        this.deleteChar(activeChar);

        activeChar.position = position;
        this.characters.push(activeChar);
        gamePlay.redrawPositions(gamePlay.teams.characters);
    }

    async attackChar(position) {
        const attacker = this.getTeamChar(gameState.activePos);
        await gamePlay.showDamage(position, attacker.attack);

        const target = this.getTeamChar(position);
        target.health -= Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        if (target.health < 0) {
            this.deleteChar(target); 
            gamePlay.clearDataset(position);
            gamePlay.deselectCell(position);
        }
        gamePlay.redrawPositions(gamePlay.teams.characters);
        return;
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
