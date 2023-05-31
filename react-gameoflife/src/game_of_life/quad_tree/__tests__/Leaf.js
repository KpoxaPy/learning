import QuadTreeMemory from "../QuadTreeMemory";
import { extract } from "../../../test_utils/spatial";

const memory = new QuadTreeMemory();

describe("Spatial information", () => {
  test("immutable 0 level", () => {
    const node = memory.leafFunctor(0, [0]);
    expect(node.get(0, 0)).toBe(0);
    expect(node.data).toStrictEqual([0]);
    node.set(0, 0, 1);
    expect(node.get(0, 0)).toBe(0);
    expect(node.data).toStrictEqual([0]);
  });

  test("immutable 1 level", () => {
    const node = memory.leafFunctor(1, [0, 0, 0, 0]);
    expect(node.get(0, 0)).toBe(0);
    expect(node.data).toStrictEqual([0, 0, 0, 0]);
    node.set(0, 0, 1);
    node.set(1, 0, 1);
    node.set(0, 1, 1);
    node.set(1, 1, 1);
    expect(node.get(0, 0)).toBe(0);
    expect(node.data).toStrictEqual([0, 0, 0, 0]);
  });


  test("0 level", () => {
    let node = memory.leafFunctor(0, [0]);
    const e = (n) => extract(n, 0, 1, 0, 1);

    expect(e(node)).toStrictEqual([[0]]);
    expect(node.data).toStrictEqual([0]);

    expect(e(node.set(0, 0, 1))).toStrictEqual([[1]]);

    expect(e(node)).toStrictEqual([[0]]);
    expect(node.data).toStrictEqual([0]);
  });

  test("1 level", () => {
    let node = memory.leafFunctor(1, [0, 0, 0, 0]);
    const e = (n) => extract(n, 0, 2, 0, 2);

    expect(e(node)).toStrictEqual([[0, 0], [0, 0]]);
    expect(node.data).toStrictEqual([0, 0, 0, 0]);

    expect(e(node.set(0, 0, 1))).toStrictEqual([[1, 0], [0, 0]]);
    expect(e(node.set(1, 0, 1))).toStrictEqual([[0, 1], [0, 0]]);
    expect(e(node.set(0, 1, 1))).toStrictEqual([[0, 0], [1, 0]]);
    expect(e(node.set(1, 1, 1))).toStrictEqual([[0, 0], [0, 1]]);

    expect(e(node.swap(0, 0))).toStrictEqual([[1, 0], [0, 0]]);
    expect(e(node.swap(1, 0))).toStrictEqual([[0, 1], [0, 0]]);
    expect(e(node.swap(0, 1))).toStrictEqual([[0, 0], [1, 0]]);
    expect(e(node.swap(1, 1))).toStrictEqual([[0, 0], [0, 1]]);

    expect(e(node)).toStrictEqual([[0, 0], [0, 0]]);
    expect(node.data).toStrictEqual([0, 0, 0, 0]);
  });

  describe("1 level quadrants", () => {
    describe("pattern1", () => {
      let node = memory.leafFunctor(1, [0, 1, 1, 0]);
      const e = (n) => extract(n, 0, 2, 0, 2);

      expect(e(node)).toStrictEqual([
        [0, 1],
        [1, 0]
      ]);
      test("ne quadrant", () => {
        expect(node.ne).toStrictEqual([0]);
      });
      test("se quadrant", () => {
        expect(node.se).toStrictEqual([1]);
      });
      test("sw quadrant", () => {
        expect(node.sw).toStrictEqual([0]);
      });
      test("nw quadrant", () => {
        expect(node.nw).toStrictEqual([1]);
      });

      expect(e(node)).toStrictEqual([
        [0, 1],
        [1, 0]
      ]);
    });
    describe("pattern2", () => {
      let node = memory.leafFunctor(1, [1, 0, 0, 1]);
      const e = (n) => extract(n, 0, 2, 0, 2);

      expect(e(node)).toStrictEqual([
        [1, 0],
        [0, 1]
      ]);
      test("ne quadrant", () => {
        expect(node.ne).toStrictEqual([1]);
      });
      test("se quadrant", () => {
        expect(node.se).toStrictEqual([0]);
      });
      test("sw quadrant", () => {
        expect(node.sw).toStrictEqual([1]);
      });
      test("nw quadrant", () => {
        expect(node.nw).toStrictEqual([0]);
      });

      expect(e(node)).toStrictEqual([
        [1, 0],
        [0, 1]
      ]);
    });
  });

  describe("1 level double", () => {
    test("pattern1", () => {
      let node = memory.leafFunctor(1, [0, 1, 1, 0]);
      const e = (n) => extract(n, 0, 2, 0, 2);
      const eAdd = (n) => extract(n, 0, 4, 0, 4);

      expect(e(node)).toStrictEqual([
        [0, 1],
        [1, 0]
      ]);

      expect(eAdd(node.double)).toStrictEqual([
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ]);

      expect(e(node)).toStrictEqual([
        [0, 1],
        [1, 0]
      ]);
    });
  });

  test("pattern2", () => {
    let node = memory.leafFunctor(1, [1, 0, 0, 1]);
    const e = (n) => extract(n, 0, 2, 0, 2);
    const eAdd = (n) => extract(n, 0, 4, 0, 4);

    expect(e(node)).toStrictEqual([
      [1, 0],
      [0, 1]
    ]);

    expect(eAdd(node.double)).toStrictEqual([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ]);

    expect(e(node)).toStrictEqual([
      [1, 0],
      [0, 1]
    ]);
  });
});