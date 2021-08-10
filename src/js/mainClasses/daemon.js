import Character from '../classes/main';

export default class Daemon extends Character {
    constructor(level) {
        super(level, 'daemon');
        this.defence = 30;
        this.attack = 20;
        this.moveRange = 1;
        this.attackRange = 4;
        this.upFromScratch();
    }
}
