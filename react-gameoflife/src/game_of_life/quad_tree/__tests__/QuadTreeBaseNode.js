import QuadTreeBaseNode from "../QuadTreeBaseNode";

test("QuadTreeBaseNode meets constrains", () => {
  const node = new QuadTreeBaseNode();

  expect(() => node.calcHash()).toThrow();
});

describe("QuadTreeBaseNode setter and getters", () => {  
  const node = new QuadTreeBaseNode();

  test("id", () => {
    expect(node.id).toBeUndefined();
    expect(node.id = 0).toBe(0);
    expect(node.id = 1).toBe(1);
  });

  test("isEmpty", () => {
    expect(node.isEmpty).toBeFalsy();
    expect(node.isEmpty = true).toBeTruthy();
    expect(node.isEmpty = false).toBeFalsy();
  });
});