export default class Card {
    constructor(turn) {
        this.content = document.querySelector(`.${turn}-card`);
        this.char = this.content.querySelector('.mana');
        this.mana = this.content.querySelector('.mana');
        this.health = this.content.querySelector('.health');
        this.attack = this.content.querySelector('.attack');
    }
                    

}