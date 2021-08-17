import GameStateService from "./GameStateService";

const service = new GameStateService(localStorage);

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
    }, 

    save(chars) {
        const state = {
            chars,
            theme: this.theme,
            gamePoints: this.gamePoints,
            maxGamePoints: this.maxGamePoints,
            activePos: this.activePos,
        }
        service.save(state);
    },

    load() {
        const { theme, gamePoints, maxGamePoints, activePos, chars} = service.load();

        gameState.theme = theme;
        gameState.gamePoints = gamePoints;
        gameState.maxGamePoints = maxGamePoints;
        gameState.activePos = activePos;

        return chars;
    }
};

export default gameState;
