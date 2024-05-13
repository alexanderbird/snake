module.Game = (async function main() {
  
  const { GameBoard } = await dependsOn('GameBoard');
  const { HtmlGameBoardRenderer } = await dependsOn('HtmlGameBoardRenderer');
  
  function initializeGame({ element }) {
    const board = new GameBoard();
    const renderer = new HtmlGameBoardRenderer();
    element.innerHTML = renderer.render(board);
  }

  return {
    initializeGame,
  }
})();
