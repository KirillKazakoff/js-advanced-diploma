import { showCharName } from './auxCss';

const genericChar = {
    type: 'generic',
    health: '',
    mana: '',
    attack: '',
    gem: 'no-gem',
}

export default class Card {
    constructor(turn) {
        this.turn = turn;

        this.content = document.querySelector(`.${turn}-card`);
        this.char = this.content.querySelector('.character');
        this.mana = this.content.querySelector('.mana');
        this.health = this.content.querySelector('.health');
        this.attack = this.content.querySelector('.attack');
        this.name = this.content.querySelector('.char-name');
        this.gem = this.content.querySelector('.gem');

        this.showGeneric();
    }

    initSpecials(char) {
        let { type, health, mana, attack, gem } = char;

        this.content.className = `card card-${type} ${this.turn}-card`;

        this.char.className = `character ${type} char-in-card`;
        this.gem.className = `gem ${gem}`;
        this.mana.textContent = mana;
        this.health.textContent = health;
        this.attack.textContent = attack;


        showCharName.call(this, type);
    }

    showCharacter(char) {
        char.health > 0 ? this.initSpecials(char) : this.showGeneric();
    }

    showGeneric() {
        this.initSpecials(genericChar);
    }
}

