module.CellReference = (async function main() {
  class CellReference {
    #row;
    #column;

    constructor({ row, column }) {
      this.#row = row;
      this.#column = column;
    }

    static parse(string) {
      const [_, column, row] = string.split(/-[cr]/);
      return new CellReference({ column: Number(column), row: Number(row) });
    }

    getRow() {
      return this.#row;
    }

    getColumn() {
      return this.#column;
    }

    toString() {
      return `cell-c${this.#column}-r${this.#row}`;
    }

    cssClass() {
      return this.toString();
    }
  }

  return {
    CellReference,
  }
})();
