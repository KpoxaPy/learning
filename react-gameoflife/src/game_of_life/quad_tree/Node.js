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

  get double() {
    const empty = this.m.memory.getEmpty(this.level - 1);
    return this.m(this.m(empty, empty, this.ne, empty),
      this.m(empty, empty, empty, this.se),
      this.m(this.sw, empty, empty, empty),
      this.m(empty, this.nw, empty, empty))
  }

  get toroidalDouble() {
    const sub = this.m(this.sw, this.nw, this.ne, this.se);
    return this.m(sub, sub, sub, sub);
  }

  get n() {
    return this.m(this.ne.nw, this.ne.sw, this.nw.se, this.nw.ne);
  }

  get e() {
    return this.m(this.ne.se, this.se.ne, this.se.nw, this.ne.sw);
  }

  get s() {
    return this.m(this.se.nw, this.se.sw, this.sw.se, this.sw.ne);
  }

  get w() {
    return this.m(this.nw.se, this.sw.ne, this.sw.nw, this.nw.sw);
  }

  get center() {
    if (this.level > 2) {
      return this.m(this.ne.sw, this.se.nw, this.sw.ne, this.nw.se);
    }

    return this.m.memory.leafFunctor(this.level - 1, [
      ...this.ne.sw,
      ...this.se.nw,
      ...this.sw.ne,
      ...this.nw.se
    ]);
  }

  iterate(rules) {
    if (this.level <= 2) {
      return this.iterateSelf(rules);
    }

    const neRes = this.ne.iterate(rules);
    const eRes = this.e.iterate(rules);
    const seRes = this.se.iterate(rules);
    const sRes = this.s.iterate(rules);
    const swRes = this.sw.iterate(rules);
    const wRes = this.w.iterate(rules);
    const nwRes = this.nw.iterate(rules);
    const nRes = this.n.iterate(rules);
    const cRes = this.center.iterate(rules);

    const neAux = this.m(neRes, eRes, cRes, nRes);
    const seAux = this.m(eRes, seRes, sRes, cRes);
    const swAux = this.m(cRes, sRes, swRes, wRes);
    const nwAux = this.m(nRes, cRes, wRes, nwRes);

    return this.m(neAux.center, seAux.center, swAux.center, nwAux.center);
  }

  iterateSelf(rules) {
    const left = this.core / 2;
    const right = this.width - left;
    let result = this.m.memory.getEmpty(this.level - 1);
    for (let x = left; x < right; ++x) {
      for (let y = left; y < right; ++y) {
        result = result.set(x - left, y - left,
          rules.iterate(this.get(x, y), (dx, dy) => this.get(x + dx, y + dy)));
      }
    }
    return result;
  }
}

export default Node;