module.Sprite = (async function main() {
  class Sprite {
    static SNAKE_HEAD = new Sprite('SNAKE_HEAD');
    static WALL = new Sprite('WALL');

    #name;

    constructor(name) {
      this.#name = name;
    }

    cssClass() {
      return `sprite__${this.#name.toLowerCase().replace(/_/g, '-')}`;
    }

    toString() {
      return this.#name;
    }
  }

  return {
    Sprite,
  }
})();
