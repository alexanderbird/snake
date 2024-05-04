document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#game').innerHTML = renderGame();
});

const dimensions = {
  columns: 64,
  rows: 64,
}

function renderGame() {
  const board = Array.from({ length: dimensions.columns }).map((_, column) =>
    Array.from({ length: dimensions.rows }).map((_, row) => ({ row, column })));
  return `
  <table>
    ${board.map(row => `
      <tr>
        ${row.map(cell => `<td><div class='cell'></div></td>`).join('')}
      </tr>
    `).join('')}
  </table>
    
  `
}
