import Character from '../classes/main';

export default class Magician extends Character {
    constructor(level) {
        super(level, 'magician');
        this.attack = 2;
        this.mana = 8;
        this.moveRange = 1;
        this.attackRange = 4;

        this.upFromScratch();
    }
}
