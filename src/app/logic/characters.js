import initTest from './initTest';
import gameState from '../../../js/gameState';
import { generateChars, genPlayerReinforceProps, getPositionedChars } from './charGen';
import Team from '../team';

export default class Characters {
    constructor(...teams) {
        if (Array.isArray(teams)) {
            this.heroes = teams.reduce((total, team) => {
                team.forEach((char) => total.push(char));
                return total;
            }, []);
        } else {
            this.init();
            this.refreshTeams();
        };
    }

    init() {
        this.teamPL = new Team(generateChars(1, 2, 'PL'));
        this.teamAI = new Team(generateChars(1, 2, 'AI'));
        this.heroes = [...this.teamPL, ...this.teamAI];
    }

    toNextLevel() {
        this.levelUp();

        const { amount, level } = genPlayerReinforceProps();
        const reinforcement = generateChars(level, amount, 'PL');
        this.addChars(reinforcement);

        const teamAI = new Characters(generateChars(level + 1, this.amount, 'AI'));
        this.addChars(teamAI.heroes);
    }

    // refreshTeams() {
    //     this.teamAI = newthis.getTeam('AI');
    //     this.teamPL = this.getTeam('PL');
    // }

    getCharsPositions() {
        return this.heroes.map((char) => char.position);
    }

    getTeamChar(position) {
        const searchRes = this.heroes.find((character) => character.position === position);
        return searchRes ? searchRes : false;
    }

    getTeam(turn) {
        return this.heroes.filter((character) => character.turn === turn);
    }

    getActiveChar() {
        return this.heroes.find((char) => char.isActive);
    }

    getChars(positions) {
        return positions.reduce((total, position) => {
            const char = this.getTeamChar(position);
            total.push(char);
            return total;
        }, []);
    }

    deleteChar(delChar) {
        const index = this.heroes.findIndex(
            (character) => character.position === delChar.position,
        );
        this.heroes.splice(index, 1);

        if (gameState.activePos === delChar.position) {
            gameState.activePos = null;
        }
    }

    moveChar(char, position) {
        this.deleteChar(char);
        char.moveTo(position);
        this.heroes.push(char);
    }

    async fight(attacker, target) {
        await attacker.fight(target);
        let isKilled = false;

        if (target.health <= 0) {            
            teams.deleteChar(target);
            isKilled = true;
        }
        return isKilled;
    }

    getAmount() {
        this.amount = this.heroes.reduce((total) => {
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
        this.heroes.forEach((character) => {
            gameState.gamePoints += +character.health.toFixed();
            character.levelUp();
        });
    }
}
