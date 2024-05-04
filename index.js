document.addEventListener('DOMContentLoaded', () => {
  const gameElement = document.querySelector('#game');
  const { onKeyDown } = initializeGame(gameElement);
  document.addEventListener('keydown', onKeyDown);
});

const configuration = {
  columns: 64,
  rows: 64,
  clockSpeed: 100,
}

function initializeGame(element) {
  const board = Array.from({ length: configuration.columns }).map((_, row) =>
    Array.from({ length: configuration.rows }).map((_, column) => new Cell({ row, column })));
  let state = GameState.initialState();
  setInterval(() => {
    const { nextState, html } = renderGame(board, state);
    state = nextState;
    element.innerHTML = html
  }, configuration.clockSpeed);
  return {
    onKeyDown: ({ key }) => {
      state.handleKey(key);
    }
  }
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

  move(direction) {
    switch (direction) {
      case Direction.UP: return this.up();
      case Direction.DOWN: return this.down();
      case Direction.RIGHT: return this.right();
      case Direction.LEFT: return this.left();
    }
  }

  down() {
    const newRow = (this.row + 1) % configuration.rows;
    return new Cell({ row: newRow, column: this.column });
  }

  up() {
    const newRow = (configuration.rows + this.row - 1) % configuration.rows;
    return new Cell({ row: newRow, column: this.column });
  }

  right() {
    const newColumn = (this.column + 1) % configuration.columns;
    return new Cell({ row: this.row, column: newColumn });
  }

  left() {
    const newColumn = (configuration.columns + this.column - 1) % configuration.columns;
    return new Cell({ row: this.row, column: newColumn });
  }
}

const Thing = {
  SNAKE_HEAD: {
    name: 'SNAKE_HEAD',
    cssClass: 'thing--snake-head',
    nextPosition: (cell, direction) => cell.move(direction)
  },
}

const Direction = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT'
}

class GameState {
  constructor(boardThings, direction) {
    this.boardThings = boardThings;
    this.direction = direction;
  }

  static initialState() {
    const initialState = {
      [new Cell({ row: 5, column: 5 })]: Thing.SNAKE_HEAD
    }
    return new GameState(initialState, Direction.RIGHT);
  }
    
  getCell(cell) {
    return this.boardThings[cell]?.cssClass || '';
  }

  handleKey(key) {
    switch (key) {
      case 'ArrowDown':
        if (this.direction !== Direction.UP) {
          this.direction = Direction.DOWN;
        }
        break;
      case 'ArrowRight':
        if (this.direction !== Direction.LEFT) {
          this.direction = Direction.RIGHT;
        }
        break;
      case 'ArrowLeft':
        if (this.direction !== Direction.RIGHT) {
          this.direction = Direction.LEFT;
        }
        break;
      case 'ArrowUp':
        if (this.direction !== Direction.DOWN) {
          this.direction = Direction.UP;
        }
        break;
    }
  }

  next() {
    const nextBoardThings = Object.fromEntries(Object.entries(this.boardThings).map(([key, value]) => {
      const newKey = value.nextPosition(Cell.parse(key), this.direction);
      return [newKey, value];
    }));
    return new GameState(nextBoardThings, this.direction);
  }
}
