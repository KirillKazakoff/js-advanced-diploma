import Character from '../classes/main';

export default class Vampire extends Character {
    constructor(name) {
        super(name, 'vampire');
        this.attack = 25;
        this.defence = 25;
        this.moveRange = 2;
        this.attackRange = 2;
    }
}
