import Character from '../classes/main';

export default class Swordsman extends Character {
    constructor(name) {
        super(name, 'swordsman');
        this.attack = 40;
        this.defence = 10;
        this.moveRange = 4;
        this.attackRange = 1;
    }
}
