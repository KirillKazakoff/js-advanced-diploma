export default {
    turn: 'player',
    level: 1,
    activePos: null,
    isCellHolded: null,
    from(object) {
        const { turn, level } = object
        this.turn = turn;
        this.level = level;
    }
}

