export default class GameState {
    static from(object) {
        this.turn = object.turn;
        this.level = object.level;
        return null;
    }
}
