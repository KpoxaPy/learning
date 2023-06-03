import QuadTreeBaseNode from "./QuadTreeBaseNode";


const NE = "ne";
const SE = "se";
const SW = "sw";
const NW = "nw";
const DIVISION = [NE, SE, SW, NW];
const MAPPING = [SW, SE, NW, NE];

class Node extends QuadTreeBaseNode {
  constructor(mem, ne, se, sw, nw) {
    const level = ne.level;
    if (!Number.isSafeInteger(level)) {
      throw Error("Node should be made of valid subnodes");
    }
    if (level !== se.level || level !== sw.level || level !== nw.level) {
      throw Error("Node should be made of same level subnodes");
    }

    super(level + 1);

    this.mem = mem;

    this.coreMask = this.core - 1;
    this.coreLevel = this.level - 1;
    this.ne = ne;
    this.se = se;
    this.sw = sw;
    this.nw = nw;
  }

  calcHash() {
    return `{${this.ne.id},${this.se.id},${this.sw.id},${this.nw.id}}`;
  }

  getSubNode(x, y) {
    return MAPPING[((y >> this.coreLevel) << 1) + (x >> this.coreLevel)];
  }

  get(x, y) {
    return this[this.getSubNode(x, y)].get(x & this.coreMask, y & this.coreMask);
  }

  set(x, y, value) {
    const arr = DIVISION.map(x => this[x]);
    const id = DIVISION.indexOf(this.getSubNode(x, y));

    arr[id] = arr[id].set(x & this.coreMask, y & this.coreMask, value);

    return this.mem.node(...arr);
  }

  swap(x, y) {
    const arr = DIVISION.map(x => this[x]);
    const id = DIVISION.indexOf(this.getSubNode(x, y));

    arr[id] = arr[id].swap(x & this.coreMask, y & this.coreMask);

    return this.mem.node(...arr);
  }

  get double() {
    const empty = this.mem.getEmpty(this.level - 1);
    return this.mem.node(
      this.mem.node(empty, empty, this.ne, empty),
      this.mem.node(empty, empty, empty, this.se),
      this.mem.node(this.sw, empty, empty, empty),
      this.mem.node(empty, this.nw, empty, empty));
  }

  get toroidalDouble() {
    const sub = this.mem.node(this.sw, this.nw, this.ne, this.se);
    return this.mem.node(sub, sub, sub, sub);
  }

  get n() {
    return this.mem.node(this.ne.nw, this.ne.sw, this.nw.se, this.nw.ne);
  }

  get e() {
    return this.mem.node(this.ne.se, this.se.ne, this.se.nw, this.ne.sw);
  }

  get s() {
    return this.mem.node(this.se.nw, this.se.sw, this.sw.se, this.sw.ne);
  }

  get w() {
    return this.mem.node(this.nw.se, this.sw.ne, this.sw.nw, this.nw.sw);
  }

  get center() {
    if (this.level > 2) {
      return this.mem.node(this.ne.sw, this.se.nw, this.sw.ne, this.nw.se);
    }

    return this.mem.leaf(this.level - 1, [
      ...this.sw.ne,
      ...this.se.nw,
      ...this.nw.se,
      ...this.ne.sw
    ]);
  }

  iterate(rules) {
    if (this.level <= 2) {
      return this.iterateSelf(rules);
    }

    const neRes = this.mem.iter(this.ne);
    const eRes = this.mem.iter(this.e);
    const seRes = this.mem.iter(this.se);
    const sRes = this.mem.iter(this.s);
    const swRes = this.mem.iter(this.sw);
    const wRes = this.mem.iter(this.w);
    const nwRes = this.mem.iter(this.nw);
    const nRes = this.mem.iter(this.n);
    const cRes = this.mem.iter(this.center);

    const neAux = this.mem.iter(this.mem.node(neRes, eRes, cRes, nRes));
    const seAux = this.mem.iter(this.mem.node(eRes, seRes, sRes, cRes));
    const swAux = this.mem.iter(this.mem.node(cRes, sRes, swRes, wRes));
    const nwAux = this.mem.iter(this.mem.node(nRes, cRes, wRes, nwRes));

    return this.mem.node(neAux, seAux, swAux, nwAux);
  }

  iterateSelf(rules) {
    const left = this.core / 2;
    const right = this.width - left;
    let result = this.mem.getEmpty(this.level - 1);
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