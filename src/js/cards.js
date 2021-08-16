export default function showFeatures(char) {
    let { turn, type, health, mana, attack } = char;
    let imgClassName = `character ${type} char-in-card`;

    const card = document.querySelector(`.${turn}-card`);

    if (health <= 0) {
        imgClassName = 'character generic char-in-card';
        mana = '';
        health = '';
        attack = '';
    }

    const charView = card.querySelector(`.character`);;
    const manaView = card.querySelector('.mana');
    const healthView = card.querySelector('.health');
    const attackView = card.querySelector('.attack');

    charView.className = imgClassName;
    manaView.textContent = mana;
    healthView.textContent = health;
    attackView.textContent = attack;
}
