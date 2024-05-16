const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { Sprite } = await diyRequire('Sprite');

  describe('Sprite', ({ it }) => {
    [
      { expectedName: 'SNAKE_HEAD', sprite: Sprite.SNAKE_HEAD },
      { expectedName: 'WALL', sprite: Sprite.WALL },
    ].forEach(({ expectedName, sprite }) => {
      it(`serializes ${expectedName} correctly`, ({ expect }) => {
        expect(sprite.toString()).toEqual(expectedName);
      });
    });
  });
})();
