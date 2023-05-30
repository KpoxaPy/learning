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
}

export default Leaf;