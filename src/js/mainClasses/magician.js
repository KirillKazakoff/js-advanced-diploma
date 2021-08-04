import Character from '../classes/main';

export default class Magician extends Character {
    constructor(name) {
        super(name, 'magician');
        this.defence = 40;
        this.attack = 10;
        this.moveRange = 1;
        this.attackRange = 4;
    }
}
