module.AsciiGameBoardRenderer = (async function main() {
  class AsciiGameBoardRenderer {
    render(gameBoard) {
      return gameBoard.getCells().map(row =>
        row.map(cell => '.').join('')
      ).join('\n');
    }
  }

  return {
    AsciiGameBoardRenderer,
  }
})();
