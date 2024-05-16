const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { GameBoard } = await diyRequire('GameBoard');
  const { AsciiGameBoardRenderer } = await diyRequire('AsciiGameBoardRenderer');

  describe('GameBoard', ({ it }) => {
    it('starts with some walls and stuff', ({ expect }) => {
      const board = new GameBoard();
      const renderer = new AsciiGameBoardRenderer();
      expect(renderer.render(board)).toMatchSnapshot();
    });
  });
})();
