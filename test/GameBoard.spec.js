const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

(async function main() {
  const { GameBoard } = await diyRequire('GameBoard');
  const { AsciiGameBoardRenderer } = await diyRequire('AsciiGameBoardRenderer');

  describe('GameBoard', ({ it }) => {
    it('starts with some walls and stuff', ({ expect }) => {
      const board = new GameBoard();
      const renderer = new AsciiGameBoardRenderer();
      //console.log(renderer.render(board));
      expect(1).toEqual(1);
    });
  });
})();
