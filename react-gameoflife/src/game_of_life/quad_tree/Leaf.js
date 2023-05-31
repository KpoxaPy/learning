import QuadTreeBaseNode from "./QuadTreeBaseNode";


class Leaf extends QuadTreeBaseNode {
  constructor(mem, level, data) {
    super(level);
    this.mem = mem;
    this.data = data;
  }

  calcHash() {
    return `<${this.data.join(',')}>`;
  }

  get(x, y) {
    return this.data[y * this.width + x];
  }

  set(x, y, value) {
    const newData = [...this.data];
    newData[y * this.width + x] = value;
    return this.mem.leaf(this.level, newData);
  }

  swap(x, y) {
    const newData = [...this.data];
    newData[y * this.width + x] = 1 - newData[y * this.width + x];
    return this.mem.leaf(this.level, newData);
  }

  get ne() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x + this.core, y + this.core);
      }
    }
    return arr;
  }

  get se() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x + this.core, y);
      }
    }
    return arr;
  }

  get sw() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x, y);
      }
    }
    return arr;
  }

  get nw() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x, y + this.core);
      }
    }
    return arr;
  }

  get double() {
    const empty = new Array(Math.pow(2, this.level - 1)).fill(0);
    return this.mem.node(
      this.mem.leaf(this.level, [...this.ne, ...empty, ...empty, ...empty]),
      this.mem.leaf(this.level, [...empty, ...empty, ...this.se, ...empty]),
      this.mem.leaf(this.level, [...empty, ...empty, ...empty, ...this.sw]),
      this.mem.leaf(this.level, [...empty, ...this.nw, ...empty, ...empty]));
  }
}

export default Leaf;