import GoL_Toroidal2d from "./toroidal2d";

const DEFAULT_RANDOM_THRESHOLD = 0.33;

class GameOfLife {
  constructor(topology, rules) {
    this.impl = null;

    if (topology.name === "toroid2d") {
      const { width: cols, height: rows } = topology.boundRect;
      this.impl = new GoL_Toroidal2d(rules, rows, cols);
    } else {
      throw Error(`not supported GoL topology: ${topology.name}`);
    }
  }

  random(threshold = DEFAULT_RANDOM_THRESHOLD) {
    this.impl.random(threshold);
  }

  clear() {
    this.impl.clear();
  }

  swapCell(x, y) {
    this.impl.swapCell(Math.floor(x), Math.floor(y));
  }

  get(x, y) {
    return this.impl.get(Math.floor(x), Math.floor(y));
  }

  runIteration() {
    this.impl.runIteration();
  }
}

export default GameOfLife;
export { DEFAULT_RANDOM_THRESHOLD };