import Character from '../classes/main';

export default class Bowman extends Character {
    constructor(level) {
        super(level, 'bowman');
        this.attack = 50;
        this.defence = 25;
        this.moveRange = 2;
        this.attackRange = 2;
        this.upFromScratch();
    }
}
