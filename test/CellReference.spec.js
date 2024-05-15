const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { CellReference } = await diyRequire('CellReference');

  describe('CellReference', ({ it }) => {
    it('considers identical row and column as equal', ({ skip }) => {
      skip();
    });

    it('considers identical row and different column as inequal', ({ skip }) => {
      skip();
    });

    it('considers different row and identical column as inequal', ({ skip }) => {
      skip();
    });

    it('can be serialized and deserialized', ({ skip }) => {
      skip();
    });
  });
})();
