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

export default QuadTreeBaseNode;