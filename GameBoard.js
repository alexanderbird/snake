module.GameBoard = (async function main() {
  class GameBoard {
    #cells;

    constructor() {
      this.#cells = Array.from({ length: 64 }).map((_, row) =>
        Array.from({ length: 64 }).map((_, column) => ({ row, column })));
    }

    getCells() {
      return this.#cells;
    }
  }

  return {
    GameBoard,
  }
})();
