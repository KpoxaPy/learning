import GoL_Toroidal2d from "./toroidal2d";

const DEFAULT_RANDOM_THRESHOLD = 0.33;

class GameOfLife {
  constructor(topology) {
    this.topology = topology;
    this.impl = null;

    if (this.topology.name === "toroid2d") {
      const { width: cols, height: rows } = this.topology.boundRect;
      this.impl = new GoL_Toroidal2d(rows, cols);
    } else {
      throw Error("not supported GoL topology");
    }
  }

  random(threshold = DEFAULT_RANDOM_THRESHOLD) {
    this.impl.random(threshold);
  }

  clear() {
    this.impl.clear();
  }

  swapCell(x, y) {
    let [tX, tY] = this.topology.transform(x, y);
    this.impl.swapCell(Math.floor(tX), Math.floor(tY));
  }

  get(x, y) {
    let [tX, tY] = this.topology.transform(x, y);
    return this.impl.get(Math.floor(tX), Math.floor(tY));
  }

  runIteration() {
    this.impl.runIteration();
  }
}

export default GameOfLife;
export { DEFAULT_RANDOM_THRESHOLD };