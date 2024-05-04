document.addEventListener('DOMContentLoaded', () => {
  const gameElement = document.querySelector('#game');
  initializeGame(gameElement);
});

const dimensions = {
  columns: 64,
  rows: 64,
}

function initializeGame(element) {
  const board = Array.from({ length: dimensions.columns }).map((_, column) =>
    Array.from({ length: dimensions.rows }).map((_, row) => new Cell({ row, column })));
  const state = new GameState();
  element.innerHTML = renderGame(board, state);
}

function renderGame(board, state) {
  return `
    <table>
      ${board.map(row => `
        <tr>
          ${row.map(cell => `<td><div class='cell ${state.getCell(cell)}'></div></td>`).join('')}
        </tr>
      `).join('')}
    </table>
  `;
}

class Cell {
  constructor({ row, column }) {
    this.row = row;
    this.column = column;
  }

  toString() {
    return `CELL-${this.column}-${this.row}`;
  }
}

const Thing = {
  SNAKE_HEAD: { name: 'SNAKE_HEAD', cssClass: 'thing--snake-head' },
}

class GameState {
  constructor() {
    this.boardThings = {
      [new Cell({ row: 5, column: 5 })]: Thing.SNAKE_HEAD
    }
  }
    
  getCell(cell) {
    return this.boardThings[cell]?.cssClass || '';
  }
}
