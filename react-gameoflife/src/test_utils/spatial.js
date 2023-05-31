function extract(node, startX, endX, startY, endY) {
  const arr = new Array(endY - startY);
  for (let y = startY; y < endY; ++y) {
    arr[y] = new Array(endX - startX);
    for (let x = startX; x < endX; ++x) {
      arr[y][x] = node.get(x, y);
    }
  }
  return arr;
}

export { extract };