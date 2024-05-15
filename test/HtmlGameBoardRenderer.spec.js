const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { HtmlGameBoardRenderer } = await diyRequire('HtmlGameBoardRenderer');

  describe('HtmlGameBoardRenderer', ({ it }) => {
    it('renders all of the item types', ({ expect }) => {
      const renderer = new HtmlGameBoardRenderer();
      const fakeBoard = {
        getCells: () => [
          [ null, null, null ],
          [ null, null, null ],
        ]
      };
      const html = renderer.render(fakeBoard);
      expect(html).toMatchSnapshot();
    });
  });
})();
