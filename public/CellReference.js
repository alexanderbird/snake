module.CellReference = (async function main() {
  class CellReference {
    #row;
    #column;

    constructor({ row, column }) {
      this.#row = row;
      this.#column = column;
    }

    toString() {
      return this.#column + '|' + this.#row;
    }
  }

  return {
    CellReference,
  }
})();
