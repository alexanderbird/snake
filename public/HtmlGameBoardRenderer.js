module.HtmlGameBoardRenderer = (async function main() {
  class HtmlGameBoardRenderer {
    render(gameBoard) {
      return `<table>${gameBoard.getCells().map(row =>
            `\n  <tr>\n${row.map(cell =>
            `    <td><div class='cell ${cell}'></div></td>`).join('\n')
            }\n  </tr>`  
          ).join('')}\n</table>
      `;
    }
  }

  return {
    HtmlGameBoardRenderer,
  }
})();
