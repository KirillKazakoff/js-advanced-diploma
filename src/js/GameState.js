function* levelGen() {
    const themes = ['prairie', 'desert', 'arctic', 'mountain'];
    let index = 0;

    while (true) {
        yield themes[index];
        index += 1;

        if (index >= themes.length) {
            index = 0;
        }
    }
}

const generator = levelGen();

const gameState = {
    level: 0,
    theme: null,

    activePos: null,
    isCellHolded: null,

    toNextLevel() {
        this.theme = generator.next().value;
        this.level += 1;
    },
}

export default gameState;
