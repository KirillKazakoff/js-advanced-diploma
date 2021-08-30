export function onNewGameClick() {
    this.gameState.newGameStart();
    this.board.renderBoard(gameState.theme, gameState.boardSize);
    initTeams();
}