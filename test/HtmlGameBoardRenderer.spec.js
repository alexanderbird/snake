const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { HtmlGameBoardRenderer } = await diyRequire('HtmlGameBoardRenderer');
  const { CellReference } = await diyRequire('CellReference');
  const { Cell } = await diyRequire('Cell');

  function cell(row, column) {
    return new Cell({
      location: new CellReference({ row, column }),
    });
  }

  describe('HtmlGameBoardRenderer', ({ it }) => {
    it('renders all of the item types', ({ expect }) => {
      const renderer = new HtmlGameBoardRenderer();
      const fakeBoard = {
        getCells: () => [
          [ cell(0, 0), cell(0, 1), cell(0, 2) ],
          [ cell(1, 0), cell(1, 1), cell(1, 2) ],
        ]
      };
      const html = renderer.render(fakeBoard);
      expect(html).toMatchSnapshot();
    });
  });
})();
