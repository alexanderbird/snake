module.GameBoard = (async function main() {
  const { CellReference } = await dependsOn('CellReference');
  const { Cell } = await dependsOn('Cell');

  class GameBoard {
    #cells;

    constructor() {
      this.#cells = Array.from({ length: 64 }).map((_, row) =>
        Array.from({ length: 64 }).map((_, column) => GameBoard.initializeCell(row, column)));
    }

    static initializeCell(row, column) {
      const reference = new CellReference({ row, column });
      return new Cell({
        location: reference,
      });
    }

    getCells() {
      return this.#cells;
    }
  }

  return {
    GameBoard,
  }
})();
