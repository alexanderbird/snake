document.addEventListener('DOMContentLoaded', () => {
  const gameElement = document.querySelector('#game');
  initializeGame(gameElement);
});

const dimensions = {
  columns: 64,
  rows: 64,
  clockSpeed: 100,
}

function initializeGame(element) {
  const board = Array.from({ length: dimensions.columns }).map((_, row) =>
    Array.from({ length: dimensions.rows }).map((_, column) => new Cell({ row, column })));
  let state = GameState.initialState();
  setInterval(() => {
    const { nextState, html } = renderGame(board, state);
    state = nextState;
    element.innerHTML = html
  }, dimensions.clockSpeed);
}

function renderGame(board, state) {
  const nextState = state.next();
  const html = `
    <table>
      ${board.map(row => `
        <tr>
          ${row.map(cell => `<td><div class='cell ${state.getCell(cell)}'></div></td>`).join('')}
        </tr>
      `).join('')}
    </table>
  `;
  return { html, nextState };
}

class Cell {
  constructor({ row, column }) {
    this.row = row;
    this.column = column;
  }

  toString() {
    return `CELL-${this.column}-${this.row}`;
  }

  static parse(text) {
    const [prefix, column, row] = text.split('-');
    return new Cell({
      row: Number(row),
      column: Number(column),
    });
  }

  right() {
    return new Cell({ row: this.row, column: this.column + 1 });
  }
}

const Thing = {
  SNAKE_HEAD: {
    name: 'SNAKE_HEAD',
    cssClass: 'thing--snake-head',
    nextPosition: cell => cell.right()
  },
}

class GameState {
  constructor(boardThings) {
    this.boardThings = boardThings;
  }

  static initialState() {
    const initialState = {
      [new Cell({ row: 5, column: 5 })]: Thing.SNAKE_HEAD
    }
    return new GameState(initialState);
  }
    
  getCell(cell) {
    return this.boardThings[cell]?.cssClass || '';
  }

  next() {
    const nextBoardThings = Object.fromEntries(Object.entries(this.boardThings).map(([key, value]) => {
      const newKey = value.nextPosition(Cell.parse(key));
      return [newKey, value];
    }));
    return new GameState(nextBoardThings);
  }
}
