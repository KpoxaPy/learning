import QuadTree from "./quad_tree";
import { QuadTreeMemory } from "./quad_tree";

class GoL_Toroidal2d {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.memory = new QuadTreeMemory();
    this.field = new QuadTree(Math.max(this.rows, this.cols), this.memory);
    console.log(this.field);
  }

  random(threshold) {
    for (let x = 0; x < this.cols; ++x) {
      for (let y = 0; y < this.rows; ++y) {
        this.field.set(x, y, Math.random() <= threshold ? 1 : 0);
      }
    }
  }

  clear() {
    this.field = new QuadTree(Math.max(this.rows, this.cols), this.memory);
    console.log(this.field);
  }

  swapCell(x, y) {
    this.field.swap(x, y);
    console.log(this.field);
  }

  get(x, y) {
    return this.field.get(x, y);
  }

  runIteration(rules) {
    this.field.iterate(rules);
  }
}

export default GoL_Toroidal2d;