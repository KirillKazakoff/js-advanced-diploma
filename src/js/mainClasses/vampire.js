import Character from '../classes/main';

export default class Vampire extends Character {
    constructor(name) {
        super(name, 'vampire');
        this.attack = 40;
        this.defence = 10;
    }
}
