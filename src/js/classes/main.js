import gamePlay from "../gamePlay";
import gameState from "../gameState";
import { calcPossiblePositions } from "../utilsSec";

export default class Character {
    constructor(level, type = 'generic') {
        if (new.target.name === 'Character') {
            throw new Error('you can\'t invoke parent class');
        }

        this.level = level;
        this.health = 5;
        this.type = type;
        this.gem = 'common';

        this.turn = null;
        this.position = null;     
    }

    levelUp() {
        if (this.health > 2) {
            this.attack += 1;
            this.mana += 1;
        }

        this.level += 1;
        this.health += 8;

        if (this.health > 10) {
            this.health = 10;
        }
    }

    upFromScratch() {
        const levelNow = this.level;
        for (let i = 1; i < levelNow; i += 1) {
            this.levelUp();
        }
    }

    getCard() {
        return gamePlay[`card${this.turn}`];
    }

    moveTo(position) {
        gameState.activePos = this.position;
        const { teams } = gamePlay;

        gamePlay.clearDataset(this.position);
        teams.deleteChar(this);

        this.position = position;
        teams.characters.push(this);
        gamePlay.redrawPositions(teams.characters);
    }

    async fight(position) {
        gameState.activePos = this.position;
        await gamePlay.showDamage(position, this.attack);
        const { teams } = gamePlay;

        const target = teams.getTeamChar(position);
        target.health -= this.attack;
        target.getCard().showCharacter(target); 

        let deletedPosition = null;
        if (target.health <= 0) {            
            teams.deleteChar(target);
            gamePlay.clearDataset(position);
            gamePlay.deselectCell(position);
            deletedPosition = position;
        }
        gamePlay.redrawPositions(gamePlay.teams.characters);

        return deletedPosition;
    }

    getHtml() {
        return gamePlay.cells.find((cell, index) => index === this.position);
    }

    getPositions(rangeParam) {
        return calcPossiblePositions(rangeParam, this.position);
    }
}
