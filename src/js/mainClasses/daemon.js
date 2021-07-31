import Character from '../classes/main';

export default class Daemon extends Character {
    constructor(name) {
        super(name, 'daemon');
        this.defence = 40;
        this.attack = 10;
    }
}
