export default function showFeatures(char) {
    const { turn, type, health, mana, attack } = char;
    const imgClassName = `character ${type} char-in-card`;

    const card = document.querySelector(`.${turn}-card`);
    const { firstElementChild } = card;

    if (firstElementChild) {
        const charView = card.querySelector(`.character`);;
        const manaView = card.querySelector('.mana');
        const healthView = card.querySelector('.health');
        const attackView = card.querySelector('.attack');

        charView.className = imgClassName;
        manaView.textContent = mana;
        healthView.textContent = health;
        attackView.textContent = attack;
        return;
    }

    const charView = document.createElement('div');
    const manaView = createFeature('mana', mana);
    const healthView = createFeature('health', health);
    const attackView = createFeature('attack', attack);

    charView.className = imgClassName;
    card.append(charView, manaView, healthView, attackView);
}

function createFeature(className, amount) {
    const view = document.createElement('span');

    view.className = `specials ${className}`;
    view.textContent = amount;
    return view;
}