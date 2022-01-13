import { createUniqueId, batch } from "solid-js";
import { createStore, StoreSetter } from "solid-js/store";
import { LtnNodes, LtnNode, LtnSchema } from "./types";

export function createNodes<S extends LtnSchema>(
  schema: S,
  initialNodes = {}
) {
  const [nodes, setNodes] = createStore<LtnNodes>(initialNodes);

  function addNode<K extends keyof S>(kind: K) {
    const id = createUniqueId();
    const io: S[K] = JSON.parse(JSON.stringify(schema[kind]));
    const node = { id, kind, position: { x: 0, y: 0 }, ...io };
    setNodes(id, node);
    return node;
  }

  function removeNode(id: string) {
    setNodes(id, undefined as unknown as LtnNode);
  }

  function useNode<N extends LtnNode>(node: N) {
    type Inputs = N["inputs"];
    type Outputs = N["outputs"];
    type GetInput<I extends keyof Inputs> = Inputs[I] extends { value: any }
      ? Inputs[I]["value"]
      : never;

    // TODO: Check if socket type "string" and value type "any" are correct.
    // Otherwise use this definition:
    /*
    function setInput<I extends keyof Inputs>(socket: I, value: GetInput<I>) {
      setNodes(node.id, "inputs", socket as any, "value" as any, value);
    }
    */
    function setInput<I extends keyof Inputs | keyof any>(
      socket: I,
      value: GetInput<I extends keyof Inputs ? I : any>
    ) {
      setNodes(node.id, "inputs", socket as any, "value" as any, value);
    }

    function setSource(
      socket: keyof Inputs,
      source: { id: string; output: string }
    ) {
      setNodes(node.id, "inputs", socket as any, "source", source);
    }

    function setOutput<O extends keyof Outputs>(socket: O, output: Outputs[O]) {
      setNodes(node.id, "outputs", socket as any, output);
    }

    function getInput(socket: keyof Inputs) {
      return batch(() => {
        if (!node.inputs) return;
        const input = node.inputs[socket as any];
        if (!input.source) return input.value;
        const sourceNode = nodes[input.source.id];
        if (!sourceNode.outputs) return;
        if (sourceNode) return sourceNode.outputs[input.source.output];
        setNodes(node.id, "inputs", socket as any, "source", undefined);
        return input.value;
      });
    }

    function setPosition(position: StoreSetter<{ x: number; y: number }>) {
      setNodes(node.id, "position", position);
    }

    return { setInput, setSource, setOutput, getInput, setPosition };
  }

  return [nodes, { addNode, removeNode, useNode }] as const;
}
