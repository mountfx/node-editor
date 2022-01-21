import { createUniqueId, batch } from "solid-js";
import { createStore } from "solid-js/store";
import { LtnNodes, LtnNode, LtnSchema } from "./types";

export function createNodes<S extends LtnSchema>(schema: S, initialNodes = {}) {
  const [nodes, setNodes] = createStore<LtnNodes>(initialNodes);

  function addNode<K extends keyof S>(kind: K) {
    const id = createUniqueId();
    const io: S[K] = JSON.parse(
      JSON.stringify({
        inputs: schema[kind].inputs,
        outputs: schema[kind].outputs,
      })
    );

    // TODO: Context potentionally has to be serialized
    const node = {
      id,
      kind,
      context: {
        title: schema[kind].context?.title || kind,
        position: { x: 0, y: 0 },
      },
      ...io,
    };
    setNodes(id, node);
    return node;
  }

  function removeNode(id: string) {
    setNodes(id, undefined as unknown as LtnNode);
  }

  function useNode<N extends LtnNode>(node: N) {
    type Inputs = N["inputs"];
    type Outputs = N["outputs"];
    type Compute = S[N["kind"]]["compute"];
    type GetInput<I extends keyof Inputs> = Inputs[I] extends { value: any }
      ? Inputs[I]["value"]
      : never;

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

    function setOutput<O extends keyof Outputs | keyof any>(
      socket: O,
      output: Outputs[O extends keyof Outputs ? O : any]
    ) {
      setNodes(node.id, "outputs", socket as any, output);
    }

    // TODO: Make this typesafe
    function setContext(key: string, value: any) {
      setNodes(node.id, "context", key, value);
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

    function getInputs() {
      const entries = Object.keys(node.inputs || {}).map((socket) => [
        socket,
        getInput(socket as keyof Inputs),
      ]);
      return Object.fromEntries(entries) as Inputs extends Record<string, any>
        ? Inputs
        : Record<string, any>;
    }

    // TODO: Fix return type to only return the type of the computed output
    function computeOutput<C extends Compute>(
      output: C extends Compute ? keyof C : never
    ): Outputs[keyof Outputs] {
      return schema[node.kind].compute?.[output as string](getInputs());
    }

    return {
      setInput,
      setSource,
      setOutput,
      setContext,
      getInput,
      getInputs,
      computeOutput,
    };
  }

  return [nodes, { addNode, removeNode, useNode }] as const;
}
