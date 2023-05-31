import QuadTree from "./quad_tree";

class GoL_Toroidal2d {
  constructor(rules, rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.memory = new QuadTree.Memory(rules);
    this.field = new QuadTree(Math.max(this.rows, this.cols), this.memory, true);
  }

  random(threshold) {
    for (let x = 0; x < this.cols; ++x) {
      for (let y = 0; y < this.rows; ++y) {
        this.field.set(x, y, Math.random() <= threshold ? 1 : 0);
      }
    }
    console.log(`Memory: table has ${this.field.memory.index.size} nodes`);
  }

  clear() {
    this.field = new QuadTree(Math.max(this.rows, this.cols), this.memory, true);
    console.log(`Memory: table has ${this.field.memory.index.size} nodes`);
  }

  swapCell(x, y) {
    this.field.swap(x, y);
    console.log(`Memory: table has ${this.field.memory.index.size} nodes`);
  }

  get(x, y) {
    return this.field.get(x, y);
  }

  runIteration() {
    this.field.iterate();
    console.log(`Memory: table has ${this.field.memory.index.size} nodes`);
  }
}

export default GoL_Toroidal2d;