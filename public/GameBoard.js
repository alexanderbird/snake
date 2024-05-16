module.GameBoard = (async function main() {
  const { CellReference } = await dependsOn('CellReference');
  const { Cell } = await dependsOn('Cell');
  const { Sprite } = await diyRequire('Sprite');

  class GameBoard {
    #cells;
    #snake;

    static #landscape = GameBoard.#getInitialLandscape();
    static #getInitialLandscape() {
      const landscape = {};
      for (let i = 0; i < 32; i++) {
        landscape[new CellReference({ row: i, column: 21 })] = Sprite.WALL
        landscape[new CellReference({ row: 63 - i, column: 31 })] = Sprite.WALL
        landscape[new CellReference({ row: i, column: 42 })] = Sprite.WALL
      }
      return landscape;
    }

    constructor() {
      this.#cells = Array.from({ length: 64 }).map((_, row) =>
        Array.from({ length: 64 }).map((_, column) => GameBoard.initializeCell(row, column)));
      this.#setSnake(new CellReference({ row: 5, column: 5 }));
    }

    #setSnake(reference) {
      this.#cells[reference.getRow()][reference.getColumn()] = new Cell({
        location: reference,
        sprite: Sprite.SNAKE_HEAD,
      });
      this.#snake = reference;
    }

    static initializeCell(row, column) {
      const reference = new CellReference({ row, column });
      const sprite = GameBoard.#landscape[reference];
      return new Cell({
        location: reference,
        sprite,
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
