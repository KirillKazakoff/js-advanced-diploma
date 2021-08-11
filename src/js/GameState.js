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
    theme: null,
    gamePoints: 0,
    maxGamePoints: 0,

    activePos: null,
    isCellHolded: null,
    underControl: true,

    toNextLevel() {
        this.theme = generator.next().value;
        gameState.underControl = true;
        gameState.activePos = null;
    },

    // checkDeletedPosition(position) {
    //     if (position === gameState.activePos) {
    //         gameState.activePos = null;
    //     }
    // }
};

export default gameState;
