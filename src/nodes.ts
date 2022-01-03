import { createUniqueId, Accessor, createMemo } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Source, IO, NodeData, Node, NodesData, Nodes } from "./nodes.types";

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

export function createEditor(): Nodes {
  const [nodes, setNodes] = createStore<NodesData>({});

  function createNode(kind: string): Node {
    const id = createUniqueId();
    const io = getIO(kind);
    const [node, setNode] = createStore<NodeData>({ id, kind, ...io });

    function setInputValue(socket: string, value: any) {
      setNode(
        produce((n: NodeData) => {
          if (!n.inputs) return;
          n.inputs[socket].value = value;
        })
      );
    }

    function setInputSource(socket: string, source: Source) {
      setNode(
        produce((n: NodeData) => {
          if (!n.inputs) return;
          n.inputs[socket].source = source;
        })
      );
    }

    function setOutput(socket: string, value: Accessor<any>) {
      setNode(
        produce((n: NodeData) => {
          if (!n.outputs) return;
          n.outputs[socket] = value;
        })
      );
      return value;
    }

    function getInput(socket: string) {
      if (!node.inputs) return;
      const input = node.inputs![socket];
      const source = input.source;
      if (!source) return input.value;
      if (!nodes[source.id]) {
        setInputSource(socket, null);
        return input.value;
      }
      const [sourceNode] = nodes[source.id];
      if (!sourceNode.outputs) return;
      return sourceNode.outputs[source.output]?.();
    }

    function getInputs() {
      const entries = Object.keys(node.inputs || {}).map((socket) => [
        socket,
        createMemo(() => getInput(socket)),
      ]);
      return Object.fromEntries(entries);
    }

    const newNode = [
      node,
      { setInputValue, setInputSource, setOutput, getInput, getInputs },
    ] as const;

    setNodes(produce((n: NodesData) => (n[id] = newNode)));
    return newNode;
  }

  function removeNode(id: string) {
    setNodes(produce((n: NodesData) => delete n[id]));
  }

  return [nodes, { createNode, removeNode }] as const;
}
