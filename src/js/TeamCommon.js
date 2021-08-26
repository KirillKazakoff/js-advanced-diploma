import gameState from './gameState';

export default class TeamCommon {
    constructor(...teams) {
        this.characters = teams.reduce((total, team) => {
            team.forEach((char) => total.push(char));
            return total;
        }, []);
        this.getAmount();
    }

    getCharsPositions() {
        return this.characters.map((char) => char.position);
    }

    getTeamChar(position) {
        const searchRes = this.characters.find((character) => character.position === position);
        return searchRes ? searchRes : false;
    }

    getTeam(turn) {
        return this.characters.filter((character) => character.turn === turn);
    }

    getChars(positions) {
        return positions.reduce((total, position) => {
            const char = this.getTeamChar(position);
            total.push(char);
            return total;
        }, []);
    }

    deleteChar(delChar) {
        const index = this.characters.findIndex(
            (character) => character.position === delChar.position,
        );
        this.characters.splice(index, 1);

        if (gameState.activePos === delChar.position) {
            gameState.activePos = null;
        }
    }

    getAmount() {
        this.amount = this.characters.reduce((total) => {
            let sum = total;
            sum += 1;
            return sum;
        }, 0);
    }

    addChars(characters) {
        characters.forEach((character) => this.characters.push(character));
        this.getAmount();
    }

    levelUp() {
        this.characters.forEach((character) => {
            gameState.gamePoints += +character.health.toFixed();
            character.levelUp();
        });
    }
}
