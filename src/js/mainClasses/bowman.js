import Character from '../classes/main';

export default class Bowman extends Character {
    constructor(level) {
        super(level, 'bowman');
        this.attack = 5;
        this.mana = 5;
        this.moveRange = 2;
        this.attackRange = 2;
        this.upFromScratch();
    }

    shot(target) {
        
    }
}
