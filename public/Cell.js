module.Cell = (async function main() {
  class Cell {
    #location;

    constructor({ location }) {
      this.#location = location;
    }

    getLocation() {
      return this.#location;
    }
  }

  return {
    Cell,
  }
})();
