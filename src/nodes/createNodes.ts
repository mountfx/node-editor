import { createUniqueId, Accessor, createMemo } from "solid-js";
import { createStore, produce, StoreSetter } from "solid-js/store";
import { Source, IO, NodeData, NodesData, Nodes, Node } from "./nodes.types";

const createIO = (kind: string): IO => {
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
          sum: null,
        },
      };
    case "subtract":
      return {
        inputs: {
          a: { value: null, source: null },
          b: { value: null, source: null },
        },
        outputs: {
          difference: null,
        },
      };
    case "multiply":
      return {
        inputs: {
          a: { value: null, source: null },
          b: { value: null, source: null },
        },
        outputs: {
          product: null,
        },
      };
    case "divide":
      return {
        inputs: {
          a: { value: null, source: null },
          b: { value: null, source: null },
        },
        outputs: {
          quotient: null,
        },
      };
    case "position":
      return {
        inputs: {
          x: { value: null, source: null },
          y: { value: null, source: null },
        },
      };
  }
  return null;
};

export function createNode(nodes: NodesData, kind: string): Node {
  const id = createUniqueId();
  const io = createIO(kind);
  const [node, setNode] = createStore<NodeData>({
    id,
    kind,
    position: { x: 0, y: 0 },
    ref: undefined,
    ...io,
  });

  function setInputValue(socket: string, inputValue: any) {
    setNode("inputs", socket, "value", inputValue);
    return inputValue;
  }

  function setInputSource(socket: string, inputSource: Source) {
    setNode("inputs", socket, "source", inputSource);
    return inputSource;
  }

  function setOutput(socket: string, output: Accessor<any>) {
    setNode("outputs", socket, () => output);
    return output;
  }

  function getInput(socket: string): Accessor<any> | null | undefined {
    if (!node.inputs) return;
    const input = node.inputs![socket];
    const source = input.source;
    if (!source) return createMemo(() => input.value);
    if (!nodes[source.id]) {
      setInputSource(socket, null);
      return createMemo(() => input.value);
    }
    const [sourceNode] = nodes[source.id];
    if (!sourceNode.outputs) return;
    return sourceNode.outputs[source.output];
  }

  function getInputs() {
    if (!node.inputs) return;
    const entries = Object.keys(node.inputs).map((socket) => [
      socket,
      getInput(socket),
    ]);
    return Object.fromEntries(entries);
  }

  type Position = { x: number; y: number };

  function setPosition(position: StoreSetter<Position>) {
    setNode("position", position);
  }

  function setRef(ref: StoreSetter<HTMLDivElement | undefined>) {
    setNode("ref", ref);
  }

  return [
    node,
    {
      setInputValue,
      setInputSource,
      setOutput,
      getInput,
      getInputs,
      setPosition,
      setRef,
    },
  ] as const;
}

export function createNodes(): Nodes {
  const [nodes, setNodes] = createStore<NodesData>({});

  function addNode(kind: string) {
    const node = createNode(nodes, kind);
    const [{ id }] = node;
    setNodes(id, node);
    return node;
  }

  function removeNode(id: string) {
    setNodes(produce<NodesData>((n) => delete n[id]));
  }

  return [nodes, { createNode: addNode, removeNode }] as const;
}
