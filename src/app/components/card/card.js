import './card.css';
import './charName/charName.css';

import cardT from "./card.tmp";
import engine from "../../lib/engine/engine";
import showCharName from "./charName/showCharName";

import genericChar from '../character/heroes/generic/generic';

export default class Card {
    constructor(turn) {
        this.turn = turn;
        this.container = document.querySelector(`.interface-${turn}`);
        this.renderCard();
        
        this.card = this.container.querySelector('.card');
        this.char = this.container.querySelector('.char-in-card');
        this.mana = this.container.querySelector('.mana');
        this.health = this.container.querySelector('.health');
        this.attack = this.container.querySelector('.attack');
        this.name = this.container.querySelector('.char-name');
        this.gem = this.container.querySelector('.gem');

        this.showGeneric();
    }

    renderCard() {
        console.log(this.container.className);
        const html = engine(cardT(genericChar));
        this.container.insertAdjacentHTML('afterbegin', html);
        console.log(this.container.className);
    }

    initSpecials(char) {
        let { type, health, mana, attack, gem } = char;

        this.card.className = `card card-${type} ${this.turn}-card`;

        this.char.className = `char-in-card ${type}`;
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

