module.AsciiGameBoardRenderer = (async function main() {
  const { Sprite } = await diyRequire('Sprite');

  class AsciiGameBoardRenderer {
    render(gameBoard) {
      return gameBoard.getCells().map(row =>
        row.map(cell => this.#renderCell(cell)).join('')
      ).join('\n');
    }

    #renderCell(cell) {
      const sprite = cell.getSprite();
      if (!sprite) {
        return '.';
      }
      switch (sprite.toString()) {
        case Sprite.WALL.toString(): return 'w';
        case Sprite.SNAKE_HEAD.toString(): return 's';
      }
    }
  }

  return {
    AsciiGameBoardRenderer,
  }
})();
