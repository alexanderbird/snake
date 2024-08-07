console.log('Open source at https://github.com/alexanderbird/snake');
const DIMENSIONS = {
  width: 50,
  height: 40,
}
const LEVELS = [
  { speed: 300, spawn: 0, spawnRamp: 0, fruit: 2 },
  { speed: 200, spawn: 0, spawnRamp: 0, fruit: 2 },
  { speed: 150, spawn: 0, spawnRamp: 0, fruit: around(3).plusOrMinus(1) },
  { speed: 150, spawn: 0.02, spawnRamp: 0, fruit: around(3).plusOrMinus(1) },
  { speed: 100, spawn: 0.02, spawnRamp: 0, fruit: around(3).plusOrMinus(1) },
  { speed: 100, spawn: 0.02, spawnRamp: -0.0005, fruit: around(3).plusOrMinus(1) },
  { speed: 100, spawn: 0.02, spawnRamp: -0.0005, fruit: around(10).plusOrMinus(4) },
  { speed: 100, spawn: 0.02, spawnRamp: -0.0005, fruit: around(10).plusOrMinus(5) },
  { speed: 90, spawn: 0.02, spawnRamp: -0.0005, fruit: around(20).plusOrMinus(5) },
  { speed: 80, spawn: 0.02, spawnRamp: -0.0005, fruit: around(20).plusOrMinus(5) },
  { speed: 80, spawn: 0.02, spawnRamp: -0.0005, fruit: around(40).plusOrMinus(5) },
  { speed: 80, spawn: 0.025, spawnRamp: -0.0005, fruit: around(40).plusOrMinus(5) },
]

function generateVeryDifficultGame(level) {
  if (level === 30) {
    return { speed: 100, spawn: 0, spawnRamp: 0, fruit: DIMENSIONS.width * DIMENSIONS.height * 2 };
  }
  const game = LEVELS[LEVELS.length - 1];
  return {
    ...game,
    speed: Math.max(100 - (3 * level), 30),
    fruit: around(30 + 2 * level).plusOrMinus(level)
  }
}

const GAME = LEVELS[currentLevel()] || generateVeryDifficultGame(currentLevel());
const GAME_SPEED = GAME.speed;
const INITIAL_FRUIT_SPAWN_LIKELIHOOD = GAME.spawn;
const FRUIT_SPAWN_LIKELIHOOD_INCREASE_RATE = GAME.spawnRamp;
const INITIAL_FRUIT_COUNT = GAME.fruit;

function currentLevel() {
  return Number(window.localStorage.getItem('level')) || 0;
}
function increaseCurrentLevel() {
  window.localStorage.setItem('level', currentLevel() + 1);
}

function around(base) {
  return {
    plusOrMinus: range => Math.round((range / -2) + Math.random() * range * 2) + base,
  }
}

let FRUIT_SPAWN_LIKELIHOOD = INITIAL_FRUIT_SPAWN_LIKELIHOOD;

class SpriteType {
  static EMPTY = new SpriteType('empty');
  static SNAKE_HEAD = new SpriteType('snake-head');
  static SNAKE_BODY = new SpriteType('snake-body');
  static OBSTACLE = new SpriteType('obstacle');
  static EDIBLE = new SpriteType('edible');
  #value

  constructor(value) {
    this.#value = value;
  }

  toString() {
    return this.#value;
  }
}

class Sprite {
  static EMPTY = new Sprite(SpriteType.EMPTY, '');
  static HEAD = new Sprite(SpriteType.SNAKE_HEAD, '⫙');
  static BODY = new Sprite(SpriteType.SNAKE_BODY, '●');
  static WALL = new Sprite(SpriteType.OBSTACLE, '▩');
  static LEMON = new Sprite(SpriteType.EDIBLE, '🍋');
  static GRAPES = new Sprite(SpriteType.EDIBLE, '🍇');
  static STRAWBERRY = new Sprite(SpriteType.EDIBLE, '🍓');
  static CHERRIES = new Sprite(SpriteType.EDIBLE, '🍒');

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

  equals(other) {
    return this.#row === other.row && this.#column === other.column;
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
    if (Array.isArray(items)) {
      this.#items = Object.fromEntries(items.map(({ position, item }) => [position, item]));
    } else {
      this.#items = items;
    }
  }

  get size() {
    return Object.keys(this.#items).length;
  }

  add(position, item) {
    return new IndexedItems({ ...this.#items, [position]: item });
  }

  map(mapper) {
    return Object.fromEntries(Object.entries(this.#items).map(([key, value]) => mapper(Position.parse(key), value)));
  }

  forEach(visitor) {
    Object.entries(this.#items).map(([key, value]) => visitor(Position.parse(key), value));
  }

  remove(position) {
    const updatedItems = Object.entries(this.#items)
      .map(([ position, item ]) => ({ position: Position.parse(position), item }))
      .filter(x => !position.equals(x.position))
    return new IndexedItems(updatedItems);
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

  static NULL = new Snake({
    position: new Position({ row: 0, column: 0 }),
    length: 0,
    direction: Direction.RIGHT
  });

  get length() {
    return this.#length;
  }

  get headPosition() {
    return this.#position;
  }

  get directionInCssUnits() {
    return this.#direction.orientationInCssUnits;
  }

  grow() {
    const opposite = this.#direction.opposite;
    return new Snake({
      position: this.#position,
      direction: this.#direction,
      length: this.#length + 1,
      tail: [
        opposite.move(opposite.move(opposite.move(this.#tail[0]))),
        opposite.move(opposite.move(this.#tail[0])),
        opposite.move(this.#tail[0]),
        ...this.#tail
      ],
    });
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
    if (!this.#length) {
      return;
    }
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
  #statistics
  constructor({ fruit, snake, walls, statistics }) {
    this.#fruit = fruit;
    this.#snake = snake;
    this.#walls = walls;
    this.#statistics = { fruit: 0, ...statistics };
  }

  forEach(visitor) {
    this.#fruit.forEach(visitor);
    this.#snake.forEach(visitor);
    this.#walls.forEach(position => visitor(position, Sprite.WALL));
  }

  handleCollisions(visitor) {
    const snakeHead = this.#snake.headPosition;
    this.forEach((position, item) => {
      if (snakeHead.equals(position) && item !== Sprite.HEAD) {
        visitor({ item, position });
      }
    });
  }

  get walls() {
    return this.#walls;
  }

  get statistics() {
    return {
      ...this.#statistics,
      remainingFruit: this.#fruit.size,
      snakeLength: this.#snake.length,
    }
  }

  get snakeDirectionInCssUnits() {
    return this.#snake.directionInCssUnits;
  }

  mutate(modifier) {
    const updates = modifier({
      fruit: this.#fruit,
      snake: this.#snake,
      walls: this.#walls,
      statistics: this.#statistics,
    });
    return new BoardState({ fruit: this.#fruit, snake: this.#snake, walls: this.#walls, statistics: this.#statistics, ...updates });
  }

  static initial() {
    const walls = [
      ...Array.from({ length: DIMENSIONS.width })
        .map((_, i) => new Position({ row: 5, column: i }))
        .filter(x => x.column > 4 && x.column < DIMENSIONS.width - 4),
      ...Array.from({ length: DIMENSIONS.width })
        .map((_, i) => new Position({ row: 10, column: i }))
        .filter(x => x.column > 4 && x.column < DIMENSIONS.width - 4),
      ...Array.from({ length: 10 })
        .map((_, i) => new Position({ row: Math.round(DIMENSIONS.height / 2) - 5 + i, column: Math.round(DIMENSIONS.width / 2) })),
      ...Array.from({ length: DIMENSIONS.width })
        .map((_, i) => new Position({ row: DIMENSIONS.height - 10, column: i }))
        .filter(x => x.column > 4 && x.column < DIMENSIONS.width - 4),
      ...Array.from({ length: DIMENSIONS.width })
        .map((_, i) => new Position({ row: DIMENSIONS.height - 5, column: i }))
        .filter(x => x.column > 4 && x.column < DIMENSIONS.width - 4),
    ];
    const fruit = new IndexedItems(Array.from({ length: INITIAL_FRUIT_COUNT }).map(() => generateRandomFruit(walls)));
    const snake = new Snake({ direction: Direction.RIGHT, length: 4, position: new Position({ row: 3, column: 10 }) });
    return new BoardState({
      fruit,
      snake,
      walls
    })
  }

}

function main() {
  document.body.style.setProperty('--game-current-level', '"' + (currentLevel() + 1) + '"');
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
  const startTime = Date.now();
  document.body.addEventListener('keydown', event => {
    state = handleKeyPress(event, state);
  });
  let gameOver = false;
  const triggerEndGame = () => { gameOver = true }
  const endGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    const stats = state.statistics;
    const win = stats.remainingFruit === 0;
    if (win) {
      increaseCurrentLevel();
    }
    document.body.dataset.gameOver = win ? 'win' : 'lose'
    document.body.style.setProperty('--game-results-time', '"' + elapsedTime(startTime) + '"');
    document.body.style.setProperty('--game-results-length', '"' + stats.snakeLength + '"');
    document.body.style.setProperty('--game-results-fruit', '"' + stats.fruit + '"');
    document.body.style.setProperty('--game-results-remaining', '"' + stats.remainingFruit + '"');
  }
  const eachTick = () => {
    if (gameOver === true) {
      endGame();
    } else {
      state = gameLoopTick(state, triggerEndGame);
      document.body.style.setProperty('--snake-orientation', state.snakeDirectionInCssUnits);
    }
  };
  const gameInterval = setInterval(eachTick, GAME_SPEED);
  eachTick();
}

function elapsedTime(startTime) {
  const endTime = Date.now();
  const totalSeconds = Math.round((endTime - startTime) / 1000);
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


function gameLoopTick(state, endGame) {
  updateBoard(getNextBoard(state));
  return nextBoardState(state, endGame);
}

function nextBoardState(previousState, endGame) {
  return previousState.mutate(({ snake, fruit, statistics }) => {
    let newSnake = snake;
    let newFruit = fruit;
    let newStatistics = statistics;
    if (Math.random() < FRUIT_SPAWN_LIKELIHOOD) {
      FRUIT_SPAWN_LIKELIHOOD = Math.max(0, FRUIT_SPAWN_LIKELIHOOD + FRUIT_SPAWN_LIKELIHOOD_INCREASE_RATE);
      const { position, item } = generateRandomFruit(previousState.walls)
      newFruit = fruit.add(position, item);
    }
    previousState.handleCollisions(({ position, item }) => {
      switch (item.type) {
        case SpriteType.SNAKE_BODY:
          endGame();
          break;
        case SpriteType.OBSTACLE:
          endGame();
          break;
        case SpriteType.EDIBLE:
          newFruit = fruit.remove(position);
          newSnake = newSnake.grow();
          newStatistics = { ...newStatistics, fruit: newStatistics.fruit + 1 };
          if (newFruit.size === 0) {
            endGame();
          }
          break;
        default:
          console.error('Unsupported Sprite Type: ' + item.type);
          break;
      }
    });
    newSnake = newSnake.move();
    return {
      statistics: newStatistics,
      snake: newSnake,
      fruit: newFruit,
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

function generateRandomFruit(walls) {
  let position;
  do {
    position = new Position({ row: Math.floor(Math.random() * DIMENSIONS.height), column: Math.floor(Math.random() * DIMENSIONS.width) });
  } while (walls.find(x => x.equals(position)));
  return {
    position,
    item: Fruit.random
  }
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
