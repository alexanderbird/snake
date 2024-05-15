module.GameBoard = (async function main() {
  const { CellReference } = await dependsOn('CellReference');
  class GameBoard {
    #cells;

    constructor() {
      this.#cells = Array.from({ length: 64 }).map((_, row) =>
        Array.from({ length: 64 }).map((_, column) => new CellReference({ row, column })));
    }

    getCells() {
      return this.#cells;
    }
  }

  return {
    GameBoard,
  }
})();
