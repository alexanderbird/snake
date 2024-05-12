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
  let gameLoopInterval;
  const updateCell = (cell, thing, gameOver) => {
    const cellElement = element.querySelector('.' + cell.toString());
    if (cellElement) {
      cellElement.className = ['cell', cell.toString(), thing].join(' ');
    } else {
      console.log('Attempted to update out of bounds cell: ' + cell.toString());
    }
    if (gameOver) {
      clearInterval(gameLoopInterval);
    }
  };
  let state = GameState.initialState(updateCell);
  element.innerHTML = renderGame(board, state);
  gameLoopInterval = setInterval(() => {
    const nextState = state.next();
    state = nextState;
  }, configuration.clockSpeed);
  return {
    onKeyDown: ({ key }) => {
      state.handleKey(key);
    }
  }
}

function renderGame(board, state) {
  return `
    <table>
      ${board.map(row => `
        <tr>
          ${row.map(cell => `<td><div class='cell ${cell}'></div></td>`).join('')}
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

function fruit(name) {
  return {
    name: `FRUIT_${name.toUpperCase()}`,
    cssClass: `thing--fruit thing--fruit-${name}`,
    nextPosition: (cell, direction) => cell,
    onCollisionFrom: (otherThing, state) => {
      if (otherThing === Thing.SNAKE_HEAD) {
        state.onFruitEaten(name);
      }
    }
  }
}

const Thing = {
  SNAKE_HEAD: {
    name: 'SNAKE_HEAD',
    cssClass: 'thing--snake-head',
    nextPosition: (cell, direction) => cell.move(direction),
    onCollisionFrom: (otherThing, state) => {
      console.error('Somehow, something collided with the snake head');
    },
  },
  WALL: {
    name: 'WALL',
    cssClass: 'thing--wall',
    nextPosition: (cell, direction) => cell,
    onCollisionFrom: (otherThing, state) => state.clearAll(),
  },
  FRUIT_APPLE: fruit('apple'),
  FRUIT_LEMON: fruit('lemon'),
  FRUIT_BLUEBERRY: fruit('blueberry'),
}

const Direction = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT'
}

class GameState {
  constructor(boardThings, direction, updateCell) {
    this.boardThings = boardThings;
    this.direction = direction;
    this.updateCell = updateCell;
  }

  static initialState(updateCell) {
    const initialState = {
      [new Cell({ row: 5, column: 5 })]: Thing.SNAKE_HEAD,
      [new Cell({ row: 22, column: 22 })]: Thing.FRUIT_APPLE,
      [new Cell({ row: 44, column: 44 })]: Thing.FRUIT_LEMON,
      [new Cell({ row: 20, column: 31 })]: Thing.FRUIT_BLUEBERRY,
    }
    for (let row = 0; row < configuration.rows / 2; row++) {
      initialState[new Cell({ row, column: 20 })] = Thing.WALL;
      initialState[new Cell({ row, column: 40 })] = Thing.WALL;
      initialState[new Cell({ row: configuration.rows - row - 1, column: 30 })] = Thing.WALL;
    }
    return new GameState(initialState, Direction.RIGHT, updateCell);
  }

  clearAll() {
    this.mapBoardThings(({ cell, thing }) => {
      this.updateCell(cell, '', true);
    });
  }

  onFruitEaten(fruit) {
    console.log(`Ate a ${fruit}`);
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

  mapBoardThings(callback) {
    return Object.entries(this.boardThings).map(([keyString, value]) => {
      const key = Cell.parse(keyString);
      return callback({ cell: key, thing: value });
    });
  }

  next() {
    const occupiedSpaces = new Set(Object.keys(this.boardThings));
    const nextBoardThings = Object.fromEntries(this.mapBoardThings(({ cell: oldKey, thing }) => {
      const newKey = thing.nextPosition(oldKey, this.direction);
      if (thing === Thing.SNAKE_HEAD && occupiedSpaces.has(newKey.toString())) {
        setTimeout(() => this.boardThings[newKey].onCollisionFrom(thing, this));
      }
      this.updateCell(oldKey, '');
      this.updateCell(newKey, thing.cssClass || '');
      return [newKey, thing];
    }));
    return new GameState(nextBoardThings, this.direction, this.updateCell);
  }
}
