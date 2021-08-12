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

let generator = levelGen();

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

    getMaxPoints() {
        const { maxGamePoints, gamePoints } = this;
        this.maxGamePoints = Math.max(maxGamePoints, gamePoints);
    },

    newGameStart() {
        generator = levelGen();
        this.toNextLevel();
        this.getMaxPoints();
    }
};

export default gameState;
