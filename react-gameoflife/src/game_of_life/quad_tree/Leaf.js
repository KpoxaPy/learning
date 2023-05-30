import QuadTreeBaseNode from "./QuadTreeBaseNode";


class Leaf extends QuadTreeBaseNode {
  constructor(level, data) {
    super(level);
    this.data = data;
  }

  calcHash() {
    return `<${this.data.join(',')}>`;
  }

  get(x, y) {
    return this.data[y * this.width + x];
  }

  set(x, y, value, m) {
    const newData = [...this.data];
    newData[y * this.width + x] = value;
    return m(new Leaf(this.level, newData));
  }

  swap(x, y, m) {
    const newData = [...this.data];
    newData[y * this.width + x] = 1 - newData[y * this.width + x];
    return m(new Leaf(this.level, newData));
  }
}

export default Leaf;