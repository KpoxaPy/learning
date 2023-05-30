import Node from "./Node";
import QuadTreeMemory from "./QuadTreeMemory";

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