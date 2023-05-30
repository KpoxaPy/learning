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
    // for (let i = 0; i < this.rows * this.cols; i++) {
    //   this.cellStates[i] = Math.random() <= threshold;
    // }
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