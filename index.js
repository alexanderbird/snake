const GAME_SPEED = 100;
const DIMENSIONS = {
  width: 50,
  height: 40,
}

class Sprite {
  static EMPTY = new Sprite('empty', '');
  static HEAD = new Sprite('snake-head', '◕');
  static BODY = new Sprite('snake-body', '●');
  static WALL = new Sprite('obstacle', '▩');
  static LEMON = new Sprite('edible', '🍋');
  static GRAPES = new Sprite('edible', '🍇');
  static STRAWBERRY = new Sprite('edible', '🍓');
  static CHERRIES = new Sprite('edible', '🍒');

  #type;
  #character;
  constructor(type, character) {
    this.#type = type;
    this.#character = character;
  }

  get type() {
    return this.#type;
  }

  toString() {
    return this.#character;
  }
}

const Fruit = Object.freeze({
  lemon: Sprite.LEMON,
  grapes: Sprite.GRAPES,
  strawberry: Sprite.STRAWBERRY,
  cherries: Sprite.CHERRIES,
  get all() {
    return Object.keys(Fruit).filter(x => x !== 'all' && x !== 'random').map(key => Fruit[key])
  },
  get random() {
    const index = Math.floor(Math.random() * Fruit.all.length);
    return Fruit.all[index]
  }
});

class Position {
  #row;
  #column;
  constructor({ row, column }) {
    this.#row = (row + DIMENSIONS.height) % DIMENSIONS.height;
    this.#column = (column + DIMENSIONS.width) % DIMENSIONS.width;
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

class Direction {
  static RIGHT = new Direction('90deg', ({ row, column }) => ({ row, column: column + 1 }), () => Direction.LEFT);
  static LEFT = new Direction('270deg', ({ row, column }) => ({ row, column: column - 1 }), () => Direction.RIGHT);
  static DOWN = new Direction('180deg', ({ row, column }) => ({ row: row + 1, column }), () => Direction.UP);
  static UP = new Direction('0deg', ({ row, column }) => ({ row: row - 1, column }), () => Direction.DOWN);

  #orientation;
  #transform;
  #opposite

  constructor(orientation, transform, opposite) {
    this.#orientation = orientation;
    this.#transform = transform;
    this.#opposite = opposite;
  }

  get opposite() {
    return this.#opposite();
  }

  get orientationInCssUnits() {
    return this.#orientation;
  }

  move(position) {
    return new Position(this.#transform(position));
  }

  static fromKeyboard(key) {
    switch(key) {
      case 'ArrowUp': return Direction.UP;
      case 'ArrowRight': return Direction.RIGHT;
      case 'ArrowDown': return Direction.DOWN;
      case 'ArrowLeft': return Direction.LEFT;
      default:
        throw new Error(`Unknown arrow key '${key}'`);
    }
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

class Snake {
  #position
  #length
  #tail
  #direction
  constructor({ length, position, direction, tail }) {
    this.#position = position;
    this.#length = length;
    this.#direction = direction;
    this.#tail = tail || Snake.generateTail({ head: position, length, direction: direction.opposite });
  }

  get directionInCssUnits() {
    return this.#direction.orientationInCssUnits;
  }

  move() {
    return new Snake({
      position: this.#direction.move(this.#position),
      direction: this.#direction,
      length: this.#length,
      tail: [...this.#tail.slice(1), this.#position],
    });
  }

  turn(direction) {
    if (
      direction === Direction.RIGHT && this.#direction === Direction.LEFT
      || direction === Direction.LEFT && this.#direction === Direction.RIGHT
      || direction === Direction.DOWN && this.#direction === Direction.UP
      || direction === Direction.UP && this.#direction === Direction.DOWN
    ) {
      return this;
    }
    return new Snake({
      position: this.#position,
      direction: direction,
      length: this.#length,
      tail: this.#tail,
    });
  }

  forEach(visitor) {
    visitor(this.#position, Sprite.HEAD);
    this.#tail.forEach(x => visitor(x, Sprite.BODY));
  }

  static generateTail({ head, length, direction }) {
    const tail = [];
    let pointer = head;
    for (let i = 1; i < length; i++) {
      pointer = direction.move(pointer);
      tail.unshift(pointer);
    }
    return tail;
  }
}

class BoardState {
  #fruit;
  #snake;
  #walls;
  constructor({ fruit, snake, walls }) {
    this.#fruit = fruit;
    this.#snake = snake;
    this.#walls = walls;
  }

  forEach(visitor) {
    this.#fruit.forEach(visitor);
    this.#snake.forEach(visitor);
    this.#walls.forEach(position => visitor(position, Sprite.WALL));
  }

  get snakeDirectionInCssUnits() {
    return this.#snake.directionInCssUnits;
  }

  mutate(modifier) {
    const updates = modifier({
      fruit: this.#fruit,
      snake: this.#snake,
      walls: this.#walls,
    });
    return new BoardState({ fruit: this.#fruit, snake: this.#snake, walls: this.#walls, ...updates });
  }

  static initial() {
    const fruit = new IndexedItems([
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: Fruit.random },
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: Fruit.random },
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: Fruit.random },
      { position: new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) }), item: Fruit.random },
    ]);
    const snake = new Snake({ direction: Direction.RIGHT, length: 4, position: new Position({ row: 3, column: 10 }) });
    const walls = Array.from({ length: DIMENSIONS.width })
      .map((_, i) => new Position({ row: 5, column: i }))
      .filter(x => x.column > 4 && x.column < DIMENSIONS.width - 4);
    return new BoardState({
      fruit,
      snake,
      walls
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
  document.body.addEventListener('keydown', event => {
    state = handleKeyPress(event, state);
  });
  const eachTick = () => {
    state = gameLoopTick(state);
    document.body.style.setProperty('--snake-orientation', state.snakeDirectionInCssUnits);
  };
  setInterval(eachTick, GAME_SPEED);
  eachTick();
}


function gameLoopTick(state) {
  updateBoard(getNextBoard(state));
  return nextBoardState(state);
}

function nextBoardState(previousState) {
  return previousState.mutate(({ snake }) => {
    return {
      snake: snake.move()
    }
  });
}

function getNextBoard(state) {
  const board = generateEmptyBoard()
  state.forEach((position, item) => {
    if (!item) {
      console.error('missing item', position, item)
    }
    if(!board[position.row]) {
      console.error(`Row ${position.row} is not on the board (item ${item})`, position);
    }
    if(!board[position.row][position.column]) {
      console.error(`Column ${position.column} is not on the board (item ${item})`, position, board[position.row][position.column]);
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
      if (!value) {
        throw new Error(`We're missing a value for ${JSON.stringify({row, column})}`)
      }
      if (!cell) {
        throw new Error(`Cannot find cell row=${row} column=${column}`);
      }
      cell.textContent = value || Sprite.EMPTY;
      cell.dataset['spriteType'] = value.type;
    });
  });
}

function generateEmptyBoard() {
  return Array.from({ length: DIMENSIONS.height }).map(() => Array.from({ length: DIMENSIONS.width }).map(() => Sprite.EMPTY));
}

function withinBoardWidth(x) {
  return (x % DIMENSIONS.width)
}

function handleKeyPress(event, state) {
  if (!event.key.startsWith("Arrow")) {
    return state;
  }
  return state.mutate(({ snake }) => {
    return {
      snake: snake.turn(Direction.fromKeyboard(event.key))
    };
  });
}

document.addEventListener('DOMContentLoaded', main);
