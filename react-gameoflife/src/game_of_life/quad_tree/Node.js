import QuadTreeBaseNode from "./QuadTreeBaseNode";


const NE = "ne";
const SE = "se";
const SW = "sw";
const NW = "nw";
const DIVISION = [NE, SE, SW, NW];

class Node extends QuadTreeBaseNode {
  constructor(level, ne, se, sw, nw) {
    super(level);
    this.ne = ne;
    this.se = se;
    this.sw = sw;
    this.nw = nw;
  }

  calcHash() {
    return `{${this.ne.id},${this.se.id},${this.sw.id},${this.nw.id}}`;
  }

  getSubNode(x, y) {
    if (x >= this.core) {
      if (y >= this.core) {
        return NE;
      } else {
        return SE;
      }
    } else if (y >= this.core) {
      return NW;
    } else {
      return SW;
    }
  }

  get(x, y) {
    const subNodeId = this.getSubNode(x, y);
    x %= this.core;
    y %= this.core;
    return this[subNodeId].get(x, y);
  }

  set(x, y, value, m) {
    const arr = DIVISION.map(x => this[x]);
    const id = DIVISION.indexOf(this.getSubNode(x, y));

    x %= this.core;
    y %= this.core;
    arr[id] = arr[id].set(x, y, value, m);

    return m(new Node(this.level, ...arr));
  }

  swap(x, y, m) {
    const arr = DIVISION.map(x => this[x]);
    const id = DIVISION.indexOf(this.getSubNode(x, y));

    x %= this.core;
    y %= this.core;
    arr[id] = arr[id].swap(x, y, m);

    return m(new Node(this.level, ...arr));
  }

  iterate(memory, rules) {
    return this;
  }
}

export default Node;