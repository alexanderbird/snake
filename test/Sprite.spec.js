const { diyRequire } = require('./diyRequire');
const { describe } = require('./diyUnit');

module.exports = (async function main() {
  const { Sprite } = await diyRequire('Sprite');

  describe('Sprite', ({ it }) => {
    [
      { expectedName: 'SNAKE_HEAD', cssClass: 'sprite__snake-head', sprite: Sprite.SNAKE_HEAD },
      { expectedName: 'WALL', cssClass: 'sprite__wall', sprite: Sprite.WALL },
    ].forEach(({ expectedName, cssClass, sprite }) => {

      it(`serializes ${expectedName} correctly`, ({ expect }) => {
        expect(sprite.toString()).toEqual(expectedName);
      });
      
      it(`has a reasonable CSS class for ${expectedName}`, ({ expect }) => {
        expect(sprite.cssClass()).toEqual(cssClass);
      });

    });
  });
})();
