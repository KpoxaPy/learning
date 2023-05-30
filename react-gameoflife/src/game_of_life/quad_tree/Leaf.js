import QuadTreeBaseNode from "./QuadTreeBaseNode";


class Leaf extends QuadTreeBaseNode {
  constructor(m, level, data) {
    super(level);
    this.m = m;
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
    return this.m(this.level, newData);
  }

  swap(x, y) {
    const newData = [...this.data];
    newData[y * this.width + x] = 1 - newData[y * this.width + x];
    return this.m(this.level, newData);
  }

  ne() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x + this.core, y + this.core);
      }
    }
    return arr;
  }

  se() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x + this.core, y);
      }
    }
    return arr;
  }

  sw() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x, y);
      }
    }
    return arr;
  }

  nw() {
    let arr = new Array(this.core * this.core);
    for (let x = 0; x < this.core; ++x) {
      for (let y = 0; y < this.core; ++y) {
        arr[y*this.core + x] = this.get(x, y + this.core);
      }
    }
    return arr;
  }

  double() {
    const empty = new Array(Math.pow(2, this.level - 1)).fill(0);
    return this.m.memory.nodeFunctor(
      this.m(this.level, [...empty, ...empty, ...this.ne(), ...empty]),
      this.m(this.level, [...empty, ...empty, ...empty, ...this.se()]),
      this.m(this.level, [...this.sw(), ...empty, ...empty, ...empty]),
      this.m(this.level, [...empty, ...this.nw(), ...empty, ...empty]));
  }
}

export default Leaf;