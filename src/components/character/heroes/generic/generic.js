import './generic.css';
import Character from "../../character";

export default class Generic extends Character {
    constructor(level) {
        super(level, 'generic');
        this.attack = '';
        this.mana = '';
        this.moveRange = '';
        this.attackRange = '';
    }
}
