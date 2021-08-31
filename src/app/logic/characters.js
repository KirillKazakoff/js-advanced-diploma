import initTest from './initTest';
import state from '../state/state';
import { generateChars, genPlayerReinforceProps, getPositionedChars } from './charGen';

export default class Characters {
    constructor(teams) {
        if (Array.isArray(teams)) {
            this.heroes = teams.reduce((total, team) => {
                team.forEach((char) => total.push(char));
                return total;
            }, []);
        } else {
            this.init();
            // this.refreshTeams();
        };
    }

    init() {
        const teamAI = generateChars(1, 2, 'PL');
        const teamPL = generateChars(1, 2, 'AI');
        this.heroes = [...teamPL, ...teamAI];
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
    //     this.teamPL = new Team(this.getTeam('PL'));
    //     this.teamAI = new Team(this.getTeam('AI'));
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

        if (state.activePos === delChar.position) {
            state.activePos = null;
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
            state.gamePoints += +character.health.toFixed();
            character.levelUp();
        });
    }
}
