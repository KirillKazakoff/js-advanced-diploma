import Character from '../classes/main';

export default class Undead extends Character {
    constructor(name) {
        super(name, 'undead');
        this.attack = 25;
        this.defence = 25;
    }
}
