import Leaf from "./Leaf";
import Node from "./Node";

class QuadTreeMemory {
  constructor(rules) {
    this.rules = rules;

    this.empty = new Map();
    this.index = new Map();
    this.table = new Map();
    this.cache = new Map();


    this.iter = (node) => {
      return this.cachedIteration(node);
    }

    this.node = (...args) => {
      return this.append(new Node(this, ...args));
    };
    
    this.leaf = (...args) => {
      return this.append(new Leaf(this, ...args));
    };
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

  cachedIteration(node) {
    if (!this.cache.has(node.hash)) {
      const iteratedNode = node.iterate(this.rules);
      this.cache.set(node.hash, iteratedNode);
      return iteratedNode;
    }
    return this.cache.get(node.hash);
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

      const node = this.leaf(level, arr);

      // base empty leaf
      if (i === 0) {
        this.empty.set(level, node);
        node.isEmpty = true;
      }
    }
  }  

  getEmpty(level) {
    if (this.empty.has(level)) {
      return this.empty.get(level);
    }

    const subNode = this.getEmpty(level - 1);
    const emptyNode = this.node(subNode, subNode, subNode, subNode);
    emptyNode.isEmpty = true;
    this.empty.set(level, emptyNode);
    return emptyNode;
  }
}

export default QuadTreeMemory;