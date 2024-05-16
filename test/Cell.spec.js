const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { CellReference } = await diyRequire('CellReference');
  const { Cell } = await diyRequire('Cell');

  describe('Cell', ({ it }) => {
    it('has a cell reference', ({ expect }) => {
      const cellReference = new CellReference({
        row: Math.round(Math.random() * 1000),
        column: Math.round(Math.random() * 1000),
      });
      const cell = new Cell({
        location: cellReference,
      });
      expect(cell.getLocation()).toEqual(cellReference);
    });
  });
})();
