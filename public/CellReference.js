module.CellReference = (async function main() {
  class CellReference {
    #row;
    #column;

    constructor({ row, column }) {
      this.#row = row;
      this.#column = column;
    }

    static parse(string) {
    }

    getRow() {
      return this.#row;
    }

    getColumn() {
      return this.#column;
    }

    toString() {
      return this.#column + '|' + this.#row;
    }
  }

  return {
    CellReference,
  }
})();
