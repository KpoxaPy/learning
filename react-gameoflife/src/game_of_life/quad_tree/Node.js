import QuadTreeBaseNode from "./QuadTreeBaseNode";


const NE = "ne";
const SE = "se";
const SW = "sw";
const NW = "nw";
const DIVISION = [NE, SE, SW, NW];

class Node extends QuadTreeBaseNode {
  constructor(m, ne, se, sw, nw) {
    const level = ne.level;
    if (!Number.isSafeInteger(level)) {
      throw Error("Node should be made of valid subnodes");
    }
    if (level !== se.level || level !== sw.level || level !== nw.level) {
      throw Error("Node should be made of same level subnodes");
    }

    super(level + 1);

    this.m = m;

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

  set(x, y, value) {
    const arr = DIVISION.map(x => this[x]);
    const id = DIVISION.indexOf(this.getSubNode(x, y));

    x %= this.core;
    y %= this.core;
    arr[id] = arr[id].set(x, y, value);

    return this.m(...arr);
  }

  swap(x, y) {
    const arr = DIVISION.map(x => this[x]);
    const id = DIVISION.indexOf(this.getSubNode(x, y));

    x %= this.core;
    y %= this.core;
    arr[id] = arr[id].swap(x, y);

    return this.m(...arr);
  }

  double() {
    const empty = this.m.memory.getEmpty(this.level - 1);
    return this.m(this.m(empty, empty, this.ne, empty),
      this.m(empty, empty, empty, this.se),
      this.m(this.sw, empty, empty, empty),
      this.m(empty, this.nw, empty, empty))
  }

  iterate(memory, rules) {
    return this;
  }
}

export default Node;