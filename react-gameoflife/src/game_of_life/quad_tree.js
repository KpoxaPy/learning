const NE = "ne";
const SE = "se";
const SW = "sw";
const NW = "nw";
const DIVISION = [NE, SE, SW, NW];

class QuadTreeBaseNode {
  constructor(level) {
    this.level = level;
    this.width = Math.pow(2, this.level);
    this.core = this.width / 2;
    this.__id = undefined;
    this.__hash = undefined;
    this.__isEmpty = false;
  }

  calcHash() {
    throw Error("BaseNode class should not be used in QuadTree as is");
  }

  get id() {
    return this.__id;
  }

  set id(id) {
    this.__id = id;
  }

  get hash() {
    if (!this.__hash) {
      this.__hash = this.calcHash();
    }
    return this.__hash;
  }

  get isEmpty() {
    return this.__isEmpty;
  }

  set isEmpty(flag) {
    this.__isEmpty = flag;
  }
}

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
};

class Leaf extends QuadTreeBaseNode {
  constructor(level, data) {
    super(level)
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
};

class QuadTreeMemory {
  constructor() {
    this.empty = new Map();
    this.index = new Map();
    this.table = new Map();
  }

  append(node) {
    if (!this.table.has(node.hash)) {
      this.table.set(node.hash, node);
      node.id = this.index.size;
      this.index.set(node.id, node);
      return node;
    }
    return this.table.get(node.hash);
  }

  canonizeLeafs(level) {
    const base = 2;
    const area = Math.pow(Math.pow(2, level), 2);
    const volume = Math.pow(base, area);
    for (let i = 0; i < volume; ++i) {
      let arr = Array(area).fill(0);
      let j = i;
      for (let k = area - 1; k >= 0; --k) {
        arr[k] = j % base;
        j >>= 1;
      }

      const node = this.append(new Leaf(level, arr));

      // base empty leaf
      if (i === 0) {
        this.empty.set(level, node);
        node.isEmpty = true;
      }
    }
  }
};

class QuadTree {
  static MINIMUM_LEVEL = 1;

  constructor(targetWidth, memory) {
    this.root = undefined;
    if (memory) {
      this.memory = memory;
    } else {
      this.memory = new QuadTreeMemory();
    }
    this.m = (n) => {
      return this.memory.append(n);
    }
    this.memory.canonizeLeafs(QuadTree.MINIMUM_LEVEL);

    const minimumWidth = Math.pow(2, QuadTree.MINIMUM_LEVEL);
    targetWidth = targetWidth ?? minimumWidth;
    targetWidth = targetWidth >= minimumWidth ? targetWidth : minimumWidth
    this.expandToWidth(targetWidth);
  }

  get(x, y) {
    // assuming we have field for (x,y)
    return this.root.get(x, y);
  }

  set(x, y, value) {
    // assuming we have field for (x,y)
    this.root = this.root.set(x, y, value, this.m);
  }

  swap(x, y) {
    // assuming we have field for (x,y)
    this.root = this.root.swap(x, y, this.m);
  }

  expandToWidth(width) {
    if (!this.root) {
      this.expand();
    }
    while (this.root.width < width) {
      this.expand();
    }
  }

  expand() {
    if (!this.root) {
      this.root = this.memory.empty.get(QuadTree.MINIMUM_LEVEL);
    } else {
      const emptyNode = this.getEmptyNode(this.root.level);
      const newNode = new Node(this.root.level + 1, emptyNode, this.root, emptyNode, emptyNode);
      this.root = this.m(newNode);
    }
  }

  getEmptyNode(level) {
    if (this.memory.empty.has(level)) {
      return this.memory.empty.get(level);
    }

    const prevEmptyNode = this.getEmptyNode(level - 1);
    let emptyNode = new Node(level, prevEmptyNode, prevEmptyNode, prevEmptyNode, prevEmptyNode);
    emptyNode = this.m(emptyNode);    
    emptyNode.isEmpty = true;
    this.memory.empty.set(level, emptyNode);
    return emptyNode;
  }

  iterate(rules) {
    return this.root.iterate(this.memory, rules);
  }
};

export default QuadTree;
export { QuadTreeMemory };