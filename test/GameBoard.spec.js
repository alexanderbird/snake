const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { GameBoard } = await diyRequire('GameBoard');
  const { AsciiGameBoardRenderer } = await diyRequire('AsciiGameBoardRenderer');

  describe('GameBoard', ({ it }) => {
    it('starts with some walls and stuff', ({ expect, skip }) => {
      const board = new GameBoard();
      const renderer = new AsciiGameBoardRenderer();
      skip();
      //expect(renderer.render(board)).toMatchSnapshot();
    });
  });
})();
