import { calcPossiblePositions } from "../../lib/utils/utils";
import { showDamage } from "./commonAnimations/commonAnimations";

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
        this.isActive = false;  
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

    moveTo(position) {
        this.position = position;
    }

    async fight(target) {
        await showDamage(target.position, this.attack);
        target.health -= this.attack;
    }

    getHtml() {
        return document.querySelector(`[data-position]=${position}`)
    }



    getMoveRange() {
        return this.getPositions('moveRange').positions;
    }

    getAttackRange() {
        return this.getPositions('attackRange').positions
    }

    getPositions(rangeParam) {
        return calcPossiblePositions(rangeParam, this.position);
    }
}
