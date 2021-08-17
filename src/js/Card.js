export default class Card {
    constructor(turn) {
        this.content = document.querySelector(`.${turn}-card`);
        this.char = this.content.querySelector('.character');
        this.mana = this.content.querySelector('.mana');
        this.health = this.content.querySelector('.health');
        this.attack = this.content.querySelector('.attack');
    }

    initSpecials(char) {
        let { type, health, mana, attack } = char;
    
        this.char.className = `character ${type} char-in-card`;
        this.mana.textContent = mana;
        this.health.textContent = health;
        this.attack.textContent = attack;
    }       
                    
    showCharacter(char) {
        char.health > 0 ? this.initSpecials(char) : this.showGeneric();
    }

    showGeneric() {
        const genericChar = {
            type: 'generic',
            health: '',
            mana: '',
            attack: '',
        }
        this.initSpecials(genericChar);
    }
}


