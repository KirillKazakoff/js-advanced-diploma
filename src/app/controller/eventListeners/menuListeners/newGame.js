import state from "../../../state/state";

export default function onNewGameClick() {
    state.newGameStart();

    this.initCharacters();
    this.board.setTheme(state.theme);
    this.board.renderChars(this.characters.heroes);
}