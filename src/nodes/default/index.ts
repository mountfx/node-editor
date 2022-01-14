import AddNode from "./AddNode";

export const defaultSchema = {
  add: {
    inputs: {
      a: { value: 0 },
      b: { value: 0 },
    },
    outputs: {
      sum: 0,
    },
  },
  subtract: {
    inputs: {
      a: { value: 0 },
      b: { value: 0 },
    },
    outputs: {
      difference: 0,
    },
    compute: {
      difference: ({ a, b }: any) => a - b,
    },
  },
  divide: {
    inputs: {
      a: { value: 0 },
      b: { value: 0 },
    },
    outputs: {
      quotient: 0,
    },
  },
};

export const defaultNodes = {
  add: AddNode,
};
