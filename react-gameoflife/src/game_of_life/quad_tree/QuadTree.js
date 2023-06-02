import QuadTreeMemory from "./QuadTreeMemory";

class QuadTree {
  static MINIMUM_LEVEL = 1;

  constructor(targetWidth, memory, isToroidal = false) {
    this.root = undefined;
    if (memory) {
      this.memory = memory;
    } else {
      this.memory = new QuadTreeMemory();
    }
    this.memory.canonizeLeafs(QuadTree.MINIMUM_LEVEL);

    const minimumWidth = Math.pow(2, QuadTree.MINIMUM_LEVEL);
    targetWidth = targetWidth ?? minimumWidth;
    targetWidth = targetWidth >= minimumWidth ? targetWidth : minimumWidth;
    this.expandToWidth(targetWidth);

    this.isToroidal = isToroidal;

    if (this.isToroidal) {
      this.get = this.getToroidal;
      this.set = this.setToroidal;
      this.swap = this.swapToroidal;
    }
  }

  getToroidal(x, y) {
    const width = this.root.width;
    x = (x % width + width) % width;
    y = (y % width + width) % width;
    return this.root.get(x, y);
  }

  setToroidal(x, y, value) {
    const width = this.root.width;
    x = (x % width + width) % width;
    y = (y % width + width) % width;
    this.root = this.root.set(x, y, value);
  }

  swapToroidal(x, y) {
    const width = this.root.width;
    x = (x % width + width) % width;
    y = (y % width + width) % width;
    this.root = this.root.swap(x, y);
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
      this.root = this.memory.getEmpty(QuadTree.MINIMUM_LEVEL);
    } else {
      this.root = this.root.double;
    }
  }

  iterate() {
    const double = this.isToroidal ?
      this.root.toroidalDouble :
      this.root.double;
      this.root = this.memory.iter(double);
  }
}

export default QuadTree;