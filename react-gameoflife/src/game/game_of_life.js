const DEFAULT_RANDOM_THRESHOLD = 0.5;

class GameOfLife {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cellStates = this.init();
    this.cellStatesBuffer = this.init();

    this.aliveNeigbors = this.init();
  }

  init() {
    return Array(this.cols * this.rows).fill(0);
  }

  swapBuffers() {
    let tmp = this.cellStates;
    this.cellStates = this.cellStatesBuffer;
    this.cellStatesBuffer = tmp;
  }

  random(threshold = DEFAULT_RANDOM_THRESHOLD) {
    for (let i = 0; i < this.rows * this.cols; i++) {
      this.cellStates[i] = Math.random() <= threshold;
    }
  }

  clear() {
    this.cellStates.fill(0);
  }

  swapCell(x, y) {
    const i = y * this.cols + x;
    this.cellStates[i] = 1 - this.cellStates[i];
  }

  get(x, y) {
    return 1 + this.cellStates[y * this.cols + x];
  }

  runIteration() {
    this.calcAliveNeighbors();
    for (let i = 0; i < this.rows * this.cols; i++) {
      const neighbors = this.aliveNeigbors[i];

      if (this.cellStates[i]) {
        this.cellStatesBuffer[i] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        this.cellStatesBuffer[i] = neighbors === 3 ? 1 : 0;
      }
    }

    this.swapBuffers();
  }

  calcAliveNeighbors() {
    const clipX = (value) => {
      if (value < 0) return this.cols + value;
      if (value >= this.cols) return value - this.cols;
      return value;
    };

    const clipY = (value) => {
      if (value < 0) return this.rows + value;
      if (value >= this.rows) return value - this.rows;
      return value;
    };

    const calc = (x, y) => {
      this.aliveNeigbors[(y - 1) * this.cols + x - 1] += 1;
      this.aliveNeigbors[(y - 1) * this.cols + x] += 1;
      this.aliveNeigbors[(y - 1) * this.cols + x + 1] += 1;

      this.aliveNeigbors[y * this.cols + x - 1] += 1;
      this.aliveNeigbors[y * this.cols + x + 1] += 1;

      this.aliveNeigbors[(y + 1) * this.cols + x - 1] += 1;
      this.aliveNeigbors[(y + 1) * this.cols + x] += 1;
      this.aliveNeigbors[(y + 1) * this.cols + x + 1] += 1;
    };

    const calcClipped = (x, y) => {
      const sX = clipX(x - 1);
      const aX = clipX(x + 1);
      const sY = clipY(y - 1);
      const aY = clipY(y + 1);

      this.aliveNeigbors[sY * this.cols + sX] += 1;
      this.aliveNeigbors[sY * this.cols + x] += 1;
      this.aliveNeigbors[sY * this.cols + aX] += 1;

      this.aliveNeigbors[y * this.cols + sX] += 1;
      this.aliveNeigbors[y * this.cols + aX] += 1;

      this.aliveNeigbors[aY * this.cols + sX] += 1;
      this.aliveNeigbors[aY * this.cols + x] += 1;
      this.aliveNeigbors[aY * this.cols + aX] += 1;
    };

    this.aliveNeigbors.fill(0);

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x = 1; x < this.cols - 1; x++) {
        if (this.cellStates[y * this.cols + x]) {
          calc(x, y);
        }
      }
    }

    for (let y of [0, this.rows - 1]) {
      for (let x = 0; x < this.cols; x++) {
        if (this.cellStates[y * this.cols + x]) {
          calcClipped(x, y);
        }
      }
    }

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x of [0, this.cols - 1]) {
        if (this.cellStates[y * this.cols + x]) {
          calcClipped(x, y);
        }
      }
    }
  }
}

export default GameOfLife;
