const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { CellReference } = await diyRequire('CellReference');

  describe('CellReference', ({ it }) => {
    it('considers identical row and column as equal', ({ expect }) => {
      const one = new CellReference({ row: 42, column: 99 });
      const two = new CellReference({ row: 42, column: 99 });
      expect(one.toString()).toEqual(two.toString());
    });

    it('considers identical row and different column as inequal', ({ expect }) => {
      const one = new CellReference({ row: 42, column: 99 });
      const two = new CellReference({ row: 42, column: 0 });
      expect(one.toString()).toNotEqual(two.toString());
    });

    it('considers different row and identical column as inequal', ({ expect }) => {
      const one = new CellReference({ row: 42, column: 99 });
      const two = new CellReference({ row: 0, column: 99 });
      expect(one.toString()).toNotEqual(two.toString());
    });

    it('does not consider 11,1 to be equal to 1,11', ({ expect }) => {
      const one = new CellReference({ row: 11, column: 1 });
      const two = new CellReference({ row: 1, column: 11 });
      expect(one.toString()).toNotEqual(two.toString());
    });

    it('can be serialized and deserialized', ({ skip }) => {
      skip();
    });
  });
})();
