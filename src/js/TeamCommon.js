import gameState from "./gameState";
import gamePlay from "./gamePlay";

export default class TeamCommon {
    constructor(...teams) {
        this.characters = teams.reduce((total, team) => {
            team.forEach((char) => total.push(char))
            return total;
        }, []);
        this.getAmount();
    }

    getCharsPositions() {
        return this.characters.map((char) => char.position);
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

    getTeam(turn) {
        return this.characters.filter((character) => character.turn === turn);
    }

    getChars(positions) {
        return positions.reduce((total, position) => {
            const char = this.getTeamChar(position);
            total.push(char);
            return total;
        }, [])
    }

    deleteChar(delChar) {
        const index = this.characters.findIndex((character) => character.position === delChar.position);
        this.characters.splice(index, 1);

        if (gameState.activePos === delChar.position) {
            gameState.activePos = null;
        }
    }

    getAmount() {
        this.amount = this.characters.reduce((total) => total += 1, 0);
    }

    addChars(characters) {
        characters.forEach((character) => this.characters.push(character));
        this.getAmount();
    }

    levelUp() {
        this.characters.forEach((character) => character.levelUp());
    }
 }
