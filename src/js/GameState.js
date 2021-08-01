// export default class GameState {
//     static from(object) {
//         this.turn = object.turn;
//         this.level = object.level;
//         return null;
//     }
//     static setActive(position) {
//         this.activePos = position
//     }
// }

export default {
    turn: 'player',
    level: 1,
    activePos: null,
    from(object) {
        const { turn, level } = object
        this.turn = turn;
        this.level = level;
    }
}

