const GAME_SPEED = 500;
const DIMENSIONS = {
  width: 50,
  height: 50,
}
const SPRITE = Object.freeze({
  head: '⬤',
  body: '●',
  wall: '▩',
  fruit: Object.freeze({
    lemon: '🍋',
    grapes: '🍇',
    strawberry: '🍓',
    cherries: '🍒',
    get all() {
      return Object.keys(SPRITE.fruit).filter(x => x !== 'all' && x !== 'random').map(key => SPRITE.fruit[key])
    },
    get random() {
      const index = Math.floor(Math.random() * SPRITE.fruit.all.length);
      return SPRITE.fruit.all[index]
    }
  })
})

class Position {
  #row;
  #column;
  constructor({ row, column }) {
    this.#row = row;
    this.#column = column;
  }

  get row() {
    return this.#row;
  }

  get column() {
    return this.#column;
  }

  static parse(string) {
    const { row, column } = JSON.parse(string);
    return new Position({ row, column });
  }

  toString() {
    return JSON.stringify({ row: this.row, column: this.column });
  }
}

class IndexedItems {
  #items;
  constructor(items = []) {
    this.#items = Object.fromEntries(items.map(({ position, item }) => [position, item]));
  }

  add(position, item) {
    this.#items[position] = item;
  }

  map(mapper) {
    return Object.fromEntries(Object.entries(this.#items).map(([key, value]) => mapper(Position.parse(key), value)));
  }

  forEach(visitor) {
    Object.entries(this.#items).map(([key, value]) => visitor(Position.parse(key), value));
  }

}

class BoardState {
  #fruit;
  #snake;
  #walls;
  constructor({ fruit, snake }) {
    this.#fruit = fruit;
    this.#snake = snake;
    this.#walls = [
      new Position({ row: 5, column: 5 }),
      new Position({ row: 5, column: 6 }),
      new Position({ row: 5, column: 7 }),
      new Position({ row: 5, column: 8 }),
      new Position({ row: 5, column: 9 }),
      new Position({ row: 5, column: 10 }),
    ]
  }

  forEach(visitor) {
    this.#fruit.forEach(visitor);
    this.#snake.forEach(visitor);
    this.#walls.forEach(position => visitor(position, SPRITE.wall));
  }

  static initial() {
    const fruit = new IndexedItems([
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: SPRITE.fruit.random },
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: SPRITE.fruit.random },
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: SPRITE.fruit.random },
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: SPRITE.fruit.random },
    ]);
    const snake = new IndexedItems([
      { position: new Position({ row: 3, column: 10 }), item: SPRITE.head },
      { position: new Position({ row: 3, column: 9 }), item: SPRITE.body },
      { position: new Position({ row: 3, column: 8 }), item: SPRITE.body },
      { position: new Position({ row: 3, column: 7 }), item: SPRITE.body },
      { position: new Position({ row: 3, column: 6 }), item: SPRITE.body },
      { position: new Position({ row: 3, column: 5 }), item: SPRITE.body },
    ]);
    return new BoardState({
      fruit,
      snake
    })
  }
}

function main() {
  const element = document.querySelector('#main');
  let html = '';
  html += '<table>'
  for (let row = 0; row < DIMENSIONS.height; row++) {
    html += '<tr>'
    for (let column = 0; column < DIMENSIONS.width; column++) {
      html += `<td data-column="${column}" data-row="${row}"></td>`
    }
    html += '</tr>'
  }
  html += '</table>'
  element.innerHTML = html;
  gameLoop();
}

function gameLoop() {
  let state = BoardState.initial();
  const eachTick = () => {
    state = gameLoopTick(state)
  };
  setInterval(eachTick, GAME_SPEED);
  eachTick();
}


function gameLoopTick(state) {
  updateBoard(getNextBoard(state));
  return nextBoardState(state);
}

function nextBoardState(previousState) {
  return previousState;
}

function getNextBoard(state) {
  const board = generateEmptyBoard()
  state.forEach((position, item) => {
    if (!item) {
      console.error('missing item', position, item)
    }
    if(board[position.row] === undefined) {
      console.error(`Row ${position.row} is not on the board (item ${item})`, position);
    }
    if(board[position.row][position.column] === undefined) {
      console.error(`Column ${position.column} is not on the board (item ${item})`, position);
    }
    board[position.row][position.column] = item;
  });
  return board;
}

function updateBoard(board) {
  board.forEach((columns, row) => {
    columns.forEach((value, column) => {
      const selector = `[data-row="${row}"][data-column="${column}"]`;
      const cell = document.querySelector(selector);
      if (!cell) {
        throw new Error(`Cannot find cell row=${row} column=${column}`);
      }
      cell.textContent = value || '';
    });
  });
}

function generateEmptyBoard() {
  return Array.from({ length: DIMENSIONS.height }).map(() => Array.from({ length: DIMENSIONS.width }).map(() => null));
}

function withinBoardWidth(x) {
  return (x % DIMENSIONS.width)
}
document.addEventListener('DOMContentLoaded', main);
