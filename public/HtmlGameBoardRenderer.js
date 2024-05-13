module.HtmlGameBoardRenderer = (async function main() {
  class HtmlGameBoardRenderer {
    render(gameBoard) {
      return `
        <table>
          ${gameBoard.getCells().map(row =>
            `<tr>${row.map(cell => `<td><div class='cell'></div></td>`).join('')}</tr>`  
          ).join('')}
      </table>
      `;
    }
  }

  return {
    HtmlGameBoardRenderer,
  }
})();
