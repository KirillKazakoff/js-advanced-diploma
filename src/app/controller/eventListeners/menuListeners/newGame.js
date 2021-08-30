export default function onNewGameClick() {
    this.gameState.newGameStart();

    this.initCharacters();
    this.board.setTheme(this.gameState.theme);
    this.board.renderChars(this.characters.heroes);
}