module.Sprite = (async function main() {
  class Sprite {
    static SNAKE_HEAD = new Sprite('SNAKE_HEAD');
    static WALL = new Sprite('WALL');

    #name;

    constructor(name) {
      this.#name = name;
    }

    toString() {
      return this.#name;
    }
  }

  return {
    Sprite,
  }
})();
