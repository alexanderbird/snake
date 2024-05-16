const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { CellReference } = await diyRequire('CellReference');
  const { Cell } = await diyRequire('Cell');
  const { Sprite } = await diyRequire('Sprite');

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

    it('has a sprite', ({ expect }) => {
      const cell = new Cell({
        sprite: Sprite.SNAKE_HEAD,
      });
      expect(cell.getSprite()).toEqual(Sprite.SNAKE_HEAD);
    });

    it('has a CSS class with only the location CSS class when there is no sprite', ({ expect }) => {
      const cellReference = new CellReference({
        row: Math.round(Math.random() * 1000),
        column: Math.round(Math.random() * 1000),
      });
      const cell = new Cell({
        location: cellReference,
      });
      expect(cell.cssClass()).toEqual(cellReference.cssClass());
    });

    it('has a CSS class with the location and the sprite', ({ expect, skip }) => {
      const cellReference = new CellReference({
        row: Math.round(Math.random() * 1000),
        column: Math.round(Math.random() * 1000),
      });
      const cell = new Cell({
        location: cellReference,
        sprite: Sprite.WALL,
      });
      expect(cell.cssClass()).toEqual(
        cellReference.cssClass()
        + ' '
        + Sprite.WALL.cssClass()
      );
    });
  });
})();
