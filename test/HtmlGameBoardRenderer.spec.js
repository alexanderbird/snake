const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { HtmlGameBoardRenderer } = await diyRequire('HtmlGameBoardRenderer');
  const { CellReference } = await diyRequire('CellReference');

  describe('HtmlGameBoardRenderer', ({ it }) => {
    it('renders all of the item types', ({ expect }) => {
      const renderer = new HtmlGameBoardRenderer();
      const fakeBoard = {
        getCells: () => [
          [ new CellReference({ row: 0, column: 0 }), new CellReference({ row: 0, column: 1 }), new CellReference({ row: 0, column: 2 }),],
          [ new CellReference({ row: 1, column: 0 }), new CellReference({ row: 1, column: 1 }), new CellReference({ row: 1, column: 2 }),],
        ]
      };
      const html = renderer.render(fakeBoard);
      expect(html).toMatchSnapshot();
    });
  });
})();
