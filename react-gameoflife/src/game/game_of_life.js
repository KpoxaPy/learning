const DEFAULT_RANDOM_THRESHOLD = 0.5;

class GameOfLife {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cellStatesBuffer = this.initCellStates();
    this.cellStates = this.initCellStates();

    this.initAliveNeigbors();
  }

  initAliveNeigbors() {
    this.aliveNeigbors = [];
    for (let y = 0; y < this.rows; y++) {
      this.aliveNeigbors[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.aliveNeigbors[y][x] = 0;
      }
    }
  }

  resetAliveNeigbors() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.aliveNeigbors[y][x] = 0;
      }
    }
  }

  initCellStates() {
    let cellStates = [];
    for (let y = 0; y < this.rows; y++) {
      cellStates[y] = [];
      for (let x = 0; x < this.cols; x++) {
        cellStates[y][x] = false;
      }
    }
    return cellStates;
  }

  modifyCellStates(buffer, fn) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        buffer[y][x] = fn(x, y, buffer[y][x]);
      }
    }
  }

  swapBuffers() {
    let tmp = this.cellStates;
    this.cellStates = this.cellStatesBuffer;
    this.cellStatesBuffer = tmp;
  }

  clearBuffer() {
    this.modifyCellStates(this.cellStatesBuffer, () => false);
  }

  random(threshold = DEFAULT_RANDOM_THRESHOLD) {
    this.modifyCellStates(this.cellStates, () => Math.random() <= threshold);
  }

  clear() {
    this.modifyCellStates(this.cellStates, () => false);
  }

  swapCell(x, y) {
    this.cellStates[y][x] = !this.cellStates[y][x];
  }

  get(x, y) {
    return this.cellStates[y][x];
  }

  runIteration() {
    this.calcAliveNeighbors();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const neighbors = this.aliveNeigbors[y][x];
        if (this.cellStates[y][x]) {
          this.cellStatesBuffer[y][x] = neighbors === 2 || neighbors === 3;
        } else {
          this.cellStatesBuffer[y][x] = neighbors === 3;
        }
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
      this.aliveNeigbors[y - 1][x - 1] += 1;
      this.aliveNeigbors[y][x - 1] += 1;
      this.aliveNeigbors[y + 1][x - 1] += 1;

      this.aliveNeigbors[y - 1][x] += 1;
      this.aliveNeigbors[y + 1][x] += 1;

      this.aliveNeigbors[y - 1][x + 1] += 1;
      this.aliveNeigbors[y][x + 1] += 1;
      this.aliveNeigbors[y + 1][x + 1] += 1;
    };

    const calcClipped = (x, y) => {
      const sX = clipX(x - 1);
      const aX = clipX(x + 1);
      const sY = clipY(y - 1);
      const aY = clipY(y + 1);
      this.aliveNeigbors[sY][sX] += 1;
      this.aliveNeigbors[y][sX] += 1;
      this.aliveNeigbors[aY][sX] += 1;

      this.aliveNeigbors[sY][x] += 1;
      this.aliveNeigbors[aY][x] += 1;

      this.aliveNeigbors[sY][aX] += 1;
      this.aliveNeigbors[y][aX] += 1;
      this.aliveNeigbors[aY][aX] += 1;
    };

    this.resetAliveNeigbors();

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x = 1; x < this.cols - 1; x++) {
        if (this.cellStates[y][x]) {
          calc(x, y);
        }
      }
    }

    for (let y of [0, this.rows - 1]) {
      for (let x = 0; x < this.cols; x++) {
        if (this.cellStates[y][x]) {
          calcClipped(x, y);
        }
      }
    }

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x of [0, this.cols - 1]) {
        if (this.cellStates[y][x]) {
          calcClipped(x, y);
        }
      }
    }
  }
}

export default GameOfLife;
