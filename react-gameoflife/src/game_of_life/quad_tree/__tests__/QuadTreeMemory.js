import QuadTreeMemory from "../QuadTreeMemory";

describe("with canon 0 level", () => {
  const canon0 = expect.objectContaining({
    __hash: "<0>",
    __id: 0,
    __isEmpty: true,
    data: [0],
    level: 0,
    width: 1
  });
  const canon1 = expect.objectContaining({
    __hash: "<1>",
    __id: 1,
    __isEmpty: false,
    data: [1],
    level: 0,
    width: 1
  });

  const empty1 = expect.objectContaining({
    __hash: "{0,0,0,0}",
    __id: 2,
    __isEmpty: true,
    level: 1,
    width: 2,
    ne: canon0,
    se: canon0,
    sw: canon0,
    nw: canon0
  });

  const empty2 = expect.objectContaining({
    __hash: "{2,2,2,2}",
    __id: 3,
    __isEmpty: true,
    level: 2,
    width: 4,
    ne: empty1,
    se: empty1,
    sw: empty1,
    nw: empty1
  });

  test("Empty memory", () => {
    const memory = new QuadTreeMemory();
    expect(memory).toMatchObject({
      empty: {},
      index: {},
      table: {}
    });
  });

  describe("Canonize 0 level", () => {
    const memory = new QuadTreeMemory();
    memory.canonizeLeafs(0);

    test("empty consits from canon0", () => {
      expect(memory.empty).toEqual(new Map([[0, canon0]]));
    });

    test("index have canonized", () => {
      expect(memory.index).toEqual(new Map([[0, canon0], [1, canon1]]));
    });

    test("table have canonized", () => {
      expect(memory.table).toEqual(new Map([["<0>", canon0], ["<1>", canon1]]));
    });

    test("getEmpty lvl0", () => {
      expect(memory.getEmpty(0)).toEqual(canon0);
    });

    test("getEmpty lvl1", () => {
      expect(memory.getEmpty(1)).toEqual(empty1);
      expect(memory.empty).toEqual(new Map([[0, canon0], [1, empty1]]));
      expect(memory.index).toEqual(new Map([[0, canon0], [1, canon1], [2, empty1]]));
      expect(memory.table).toEqual(new Map([["<0>", canon0], ["<1>", canon1], ["{0,0,0,0}", empty1]]));
    });

    test("getEmpty lvl2", () => {
      expect(memory.getEmpty(2)).toEqual(empty2);
      expect(memory.empty).toEqual(new Map([
        [0, canon0],
        [1, empty1],
        [2, empty2]
      ]));
      expect(memory.index).toEqual(new Map([
        [0, canon0],
        [1, canon1],
        [2, empty1],
        [3, empty2]
      ]));
      expect(memory.table).toEqual(new Map([
        ["<0>", canon0],
        ["<1>", canon1],
        ["{0,0,0,0}", empty1],
        ["{2,2,2,2}", empty2]
      ]));
    });
  });
});

describe("with canon 1 level", () => {
  const canon0000 = expect.objectContaining({
    __hash: "<0,0,0,0>",
    __id: 0,
    __isEmpty: true,
    data: [0, 0, 0, 0],
    level: 1,
    width: 2
  });
  const canon0001 = expect.objectContaining({
    __hash: "<0,0,0,1>",
    __id: 1,
    __isEmpty: false,
    data: [0, 0, 0, 1],
    level: 1,
    width: 2
  });
  const canon0010 = expect.objectContaining({
    __hash: "<0,0,1,0>",
    __id: 2,
    __isEmpty: false,
    data: [0, 0, 1, 0],
    level: 1,
    width: 2
  });
  const canon0011 = expect.objectContaining({
    __hash: "<0,0,1,1>",
    __id: 3,
    __isEmpty: false,
    data: [0, 0, 1, 1],
    level: 1,
    width: 2
  });
  const canon0100 = expect.objectContaining({
    __hash: "<0,1,0,0>",
    __id: 4,
    __isEmpty: false,
    data: [0, 1, 0, 0],
    level: 1,
    width: 2
  });
  const canon0101 = expect.objectContaining({
    __hash: "<0,1,0,1>",
    __id: 5,
    __isEmpty: false,
    data: [0, 1, 0, 1],
    level: 1,
    width: 2
  });
  const canon0110 = expect.objectContaining({
    __hash: "<0,1,1,0>",
    __id: 6,
    __isEmpty: false,
    data: [0, 1, 1, 0],
    level: 1,
    width: 2
  });
  const canon0111 = expect.objectContaining({
    __hash: "<0,1,1,1>",
    __id: 7,
    __isEmpty: false,
    data: [0, 1, 1, 1],
    level: 1,
    width: 2
  });
  const canon1000 = expect.objectContaining({
    __hash: "<1,0,0,0>",
    __id: 8,
    __isEmpty: false,
    data: [1, 0, 0, 0],
    level: 1,
    width: 2
  });
  const canon1001 = expect.objectContaining({
    __hash: "<1,0,0,1>",
    __id: 9,
    __isEmpty: false,
    data: [1, 0, 0, 1],
    level: 1,
    width: 2
  });
  const canon1010 = expect.objectContaining({
    __hash: "<1,0,1,0>",
    __id: 10,
    __isEmpty: false,
    data: [1, 0, 1, 0],
    level: 1,
    width: 2
  });
  const canon1011 = expect.objectContaining({
    __hash: "<1,0,1,1>",
    __id: 11,
    __isEmpty: false,
    data: [1, 0, 1, 1],
    level: 1,
    width: 2
  });
  const canon1100 = expect.objectContaining({
    __hash: "<1,1,0,0>",
    __id: 12,
    __isEmpty: false,
    data: [1, 1, 0, 0],
    level: 1,
    width: 2
  });
  const canon1101 = expect.objectContaining({
    __hash: "<1,1,0,1>",
    __id: 13,
    __isEmpty: false,
    data: [1, 1, 0, 1],
    level: 1,
    width: 2
  });
  const canon1110 = expect.objectContaining({
    __hash: "<1,1,1,0>",
    __id: 14,
    __isEmpty: false,
    data: [1, 1, 1, 0],
    level: 1,
    width: 2
  });
  const canon1111 = expect.objectContaining({
    __hash: "<1,1,1,1>",
    __id: 15,
    __isEmpty: false,
    data: [1, 1, 1, 1],
    level: 1,
    width: 2
  });

  const empty2 = expect.objectContaining({
    __hash: "{0,0,0,0}",
    __id: 16,
    __isEmpty: true,
    level: 2,
    width: 4,
    ne: canon0000,
    se: canon0000,
    sw: canon0000,
    nw: canon0000
  });

  const empty3 = expect.objectContaining({
    __hash: "{16,16,16,16}",
    __id: 17,
    __isEmpty: true,
    level: 3,
    width: 8,
    ne: empty2,
    se: empty2,
    sw: empty2,
    nw: empty2
  });

  test("Empty memory", () => {
    const memory = new QuadTreeMemory();
    expect(memory).toMatchObject({
      empty: {},
      index: {},
      table: {}
    });
  });

  describe("Canonize 1 level", () => {
    const expectedEmpty = new Map([
      [1, canon0000],
    ]);

    const expectedIndex = new Map([
      [0, canon0000],
      [1, canon0001],
      [2, canon0010],
      [3, canon0011],
      [4, canon0100],
      [5, canon0101],
      [6, canon0110],
      [7, canon0111],
      [8, canon1000],
      [9, canon1001],
      [10, canon1010],
      [11, canon1011],
      [12, canon1100],
      [13, canon1101],
      [14, canon1110],
      [15, canon1111],
    ]);

    const expectedTable = new Map([
      ["<0,0,0,0>", canon0000],
      ["<0,0,0,1>", canon0001],
      ["<0,0,1,0>", canon0010],
      ["<0,0,1,1>", canon0011],
      ["<0,1,0,0>", canon0100],
      ["<0,1,0,1>", canon0101],
      ["<0,1,1,0>", canon0110],
      ["<0,1,1,1>", canon0111],
      ["<1,0,0,0>", canon1000],
      ["<1,0,0,1>", canon1001],
      ["<1,0,1,0>", canon1010],
      ["<1,0,1,1>", canon1011],
      ["<1,1,0,0>", canon1100],
      ["<1,1,0,1>", canon1101],
      ["<1,1,1,0>", canon1110],
      ["<1,1,1,1>", canon1111],
    ]);

    const memory = new QuadTreeMemory();
    memory.canonizeLeafs(1);

    test("empty consits from canon0000", () => {
      const expectedEmptyHere = new Map(expectedEmpty);
      expect(memory.empty).toEqual(expectedEmptyHere);
    });

    test("index have canonized", () => {
      const expectedIndexHere = new Map(expectedIndex);
      expect(memory.index).toEqual(expectedIndexHere);
    });

    test("table have canonized", () => {
      const expectedTableHere = new Map(expectedTable);
      expect(memory.table).toEqual(expectedTableHere);
    });

    test("getEmpty lvl1", () => {
      expect(memory.getEmpty(1)).toEqual(canon0000);
    });


    test("getEmpty lvl2", () => {
      const expectedEmptyHere = new Map(expectedEmpty).set(2, empty2);
      const expectedIndexHere = new Map(expectedIndex).set(16, empty2);;
      const expectedTableHere = new Map(expectedTable).set("{0,0,0,0}", empty2);

      expect(memory.getEmpty(2)).toEqual(empty2);
      expect(memory.empty).toEqual(expectedEmptyHere);
      expect(memory.index).toEqual(expectedIndexHere);
      expect(memory.table).toEqual(expectedTableHere);
    });

    test("getEmpty lvl3", () => {
      const expectedEmptyHere = new Map(expectedEmpty)
        .set(2, empty2)
        .set(3, empty3);
      const expectedIndexHere = new Map(expectedIndex)
        .set(16, empty2)
        .set(17, empty3);
      const expectedTableHere = new Map(expectedTable)
        .set("{0,0,0,0}", empty2)
        .set("{16,16,16,16}", empty3);

      expect(memory.getEmpty(3)).toEqual(empty3);
      expect(memory.empty).toEqual(expectedEmptyHere);
      expect(memory.index).toEqual(expectedIndexHere);
      expect(memory.table).toEqual(expectedTableHere);

    });
  });
});

describe("several appends", () => {
  const memory = new QuadTreeMemory();

  const appendArgs = [0, [1]];
  const appendResult = expect.objectContaining({
    __hash: "<1>",
    __id: 0,
    __isEmpty: false,
    data: [1],
    level: 0,
    width: 1
  });
  let objectRet = null;
  
  test("first append", () => {
    objectRet = memory.leaf(...appendArgs);
    expect(objectRet).toEqual(appendResult);
  });
  
  test("second append", () => {
    const objectRetHere = memory.leaf(...appendArgs);
    expect(objectRetHere).toEqual(appendResult);
    expect(objectRetHere).toBe(objectRet);
  });
});