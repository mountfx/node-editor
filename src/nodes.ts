import { createUniqueId } from "solid-js";
import { createStore, produce } from "solid-js/store";

type Source = {
  readonly id: string,
  readonly output: string,
} | null;

type Input = { value: any, source: Source };
type Output = any;

type IO = {
  inputs?: Record<string, Input>,
  outputs?: Record<string, Output>,
};

export type NodeData = {
  readonly id: string,
  readonly kind: string,
  readonly inputs?: IO["inputs"],
  readonly outputs?: IO["outputs"],
};

export type Node = Readonly<[NodeData, {
  readonly setInputValue: (socket: string, value: any) => void,
  readonly setInputSource: (socket: string, source: Source) => void,
  readonly setOutput: (socket: string, value: any) => void,
  readonly getInput: (socket: string) => any,
}]>;

export type NodesData = {
  [key: string]: Node,
};

export type Nodes = Readonly<[NodesData, {
  readonly createNode: (kind: string) => Node,
  readonly removeNode: (id: string) => void,
}]>;

const getIO = (kind: string): IO => {
  switch (kind) {
    case "number":
      return {
        inputs: {
          number: { value: null, source: null },
        },
        outputs: {
          number: null,
        },
      };
    case "add":
      return {
        inputs: {
          a: { value: null, source: null },
          b: { value: null, source: null },
        },
        outputs: {
          sum: null
        },
      };
    case "position":
      return {
        inputs: {
          x: { value: null, source: null },
          y: { value: null, source: null },
        },
      };
  };
  return {
    inputs: undefined,
    outputs: undefined,
  };
};

export function createEditor(): Nodes {
  const [nodes, setNodes] = createStore<NodesData>({});
  
  function createNode(kind: string): Node {
    const id = createUniqueId();
    const io = getIO(kind);
    const [node, setNode] = createStore<NodeData>({ id, kind, ...io });

    function setInputValue(socket: string, value: any) {
      setNode(produce((n: NodeData) => {
        if (!n.inputs) return;
        n.inputs[socket].value = value;
      }));
    };

    function setInputSource(socket: string, source: Source) {
      setNode(produce((n: NodeData) => {
        if (!n.inputs) return;
        n.inputs[socket].source = source;
      }));
    };

    function setOutput(socket: string, value: any) {
      setNode(produce((n: NodeData) => {
        if (!n.outputs) return;
        n.outputs[socket] = value;
      }));
    };

    function getInput(socket: string) {
      if (!node.inputs) return;
      const input = node.inputs[socket];
      const source = input.source;
      if (!source) return input.value;
      if (!nodes[source.id]) {
        setInputSource(socket, null);
        return input.value;
      };
      const [sourceNode] = nodes[source.id];
      if (!sourceNode.outputs) return;
      return sourceNode.outputs[source.output];
    };

    const newNode = [node, { setInputValue, setInputSource, setOutput, getInput }] as const;

    setNodes(produce((n: NodesData) => n[id] = newNode));
    return newNode;
  };

  function removeNode(id: string) {
    setNodes(produce((n: NodesData) => delete n[id]));
  };

  return [nodes, { createNode, removeNode }] as const;
};