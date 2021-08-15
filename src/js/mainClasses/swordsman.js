import Character from '../classes/main';

export default class Swordsman extends Character {
    constructor(level) {
        super(level, 'swordsman');
        this.attack = 4;
        this.mana = 4;
        this.moveRange = 4;
        this.attackRange = 1;
        this.upFromScratch();
    }
}
