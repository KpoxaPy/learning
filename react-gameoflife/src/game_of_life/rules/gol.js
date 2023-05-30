class GoL_Rules {
  iterate(value, neighborsFunc) {
    const neighbors = this.calcAliveNeighbors(neighborsFunc);

    if (value) {
      return neighbors === 2 || neighbors === 3 ? 1 : 0;
    }
    return neighbors === 3 ? 1 : 0;
  }


  calcAliveNeighbors(neighborsFunc) {
    return neighborsFunc(-1, -1)
      + neighborsFunc(-1, 0)
      + neighborsFunc(-1, 1)
      + neighborsFunc(0, -1)
      + neighborsFunc(0, 1)
      + neighborsFunc(1, -1)
      + neighborsFunc(1, 0)
      + neighborsFunc(1, 1);
  }
};

export default GoL_Rules;