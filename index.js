const GAME_SPEED = 100;
const DIMENSIONS = {
  width: 50,
  height: 50,
}
const cannedBoards = Array.from({ length: DIMENSIONS.width }).map((_, i) => generateBoard(i));

let nthTick = 0;

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
  setInterval(gameLoopTick, GAME_SPEED);
}


function gameLoopTick() {
  updateBoard(getNextBoard());
}

function getNextBoard() {
  nthTick = (nthTick + 1) % cannedBoards.length;
  return cannedBoards[nthTick];
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

function generateBoard(n) {
  const newBoard = Array.from({ length: DIMENSIONS.height }).map(() => 
    Array.from({ length: DIMENSIONS.width }).map(() => null)
    );
  const snakeHead = n + 5;
  newBoard[3][withinBoardWidth(snakeHead)] = 'H'
  newBoard[3][withinBoardWidth(snakeHead - 1)] = 'B'
  newBoard[3][withinBoardWidth(snakeHead - 2)] = 'B'
  newBoard[3][withinBoardWidth(snakeHead - 3)] = 'B'
  return newBoard;
}

function withinBoardWidth(x) {
  return (x % DIMENSIONS.width)
}
document.addEventListener('DOMContentLoaded', main);
