import charNameT from "./aux/charName.tmp";

const cardCharT = (type) => ({
    block: 'div',
    cls: `character ${type} char-in-card`,
    content: '',
});

const cardGemT = (gem) => ({
    block: 'div',
    cls: `gem ${gem}`,
    content: '',
});

const cardManaT = (mana) => ({
    block: 'div',
    cls: `specials ${mana}`,
    content: '',
});

const cardHealthT = (health) => ({
    block: 'div',
    cls: `specials ${health}`,
    content: '',
});

const cardAttackT = (attack) => ({
    block: 'div',
    cls: `specials ${health}`,
    content: '', 
});

const cardT = (char) => ({
    block: 'div',
    cls: `card card-${char.type}`,
    content: getCardContent(char),
});

function getCardContent(char) {
    const char = cardCharT(char.type);
    const gem = cardGemT(char.gem);
    const mana = cardManaT(char.mana);
    const health = cardHealthT(char.health);
    const attack = cardAttackT(char.attack);
    const charName = charNameT(char.type);

    return [char, gem, mana, health, attack, charName];
};

export default cardT;
