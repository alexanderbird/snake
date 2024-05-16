module.Cell = (async function main() {
  class Cell {
    #location;
    #sprite;

    constructor({ location, sprite }) {
      this.#location = location;
      this.#sprite = sprite;
    }

    getLocation() {
      return this.#location;
    }

    getSprite() {
      return this.#sprite;
    }

    cssClass() {
      return [this.#location, this.#sprite]
        .filter(x => !!x)
        .map(x => x.cssClass())
        .join(' ');
    }
  }

  return {
    Cell,
  }
})();
