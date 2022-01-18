/* --- Utils --- */
import { Component, For } from "solid-js";

/* --- Nodes --- */
import { createNodes } from "./nodes";
import { defaultSchema } from "./nodes/defaults";
import Node from "./nodes/Node";
import type { LtnNode } from "./nodes/types";

/* --- Canvas --- */
import { Canvas, CanvasNode, Camera, SelectOverlay } from "./canvas";

// Define nodes by using a schema
export const [nodes, { addNode, removeNode, useNode }] = createNodes({
  multiply: {
    inputs: {
      a: { value: 0 },
      b: { value: 0 },
    },
    outputs: {
      product: 0,
    },
    compute: {
      product: ({ a, b }) => a * b,
    },
  },
  ...defaultSchema,
});

const App: Component = () => {
  return (
    <>
      <div style={{ position: "absolute", "z-index": 1 }}>
        <button onClick={() => console.log(nodes)}>Log</button>
        <button onClick={() => console.log(JSON.stringify(nodes, null, 2))}>
          Log Raw
        </button>
        <button onClick={() => addNode("add")}>Add Add Node</button>
        <button onClick={() => addNode("subtract")}>Add Subtract Node</button>
        <button onClick={() => addNode("multiply")}>
          Add Multiply Node (Custom)
        </button>
        <button onClick={() => addNode("divide")}>Add Divide Node</button>
      </div>
      <Canvas
        transform={(node, position) =>
          useNode<LtnNode>(node).setContext("position", position)
        }
      >
        <Camera>
          <For each={Object.values(nodes)}>
            {(node) => (
              <CanvasNode node={node} position={node.context?.position}>
                <Node node={node} schema={{ ...defaultSchema }} />
              </CanvasNode>
            )}
          </For>
        </Camera>
        <SelectOverlay />
      </Canvas>
    </>
  );
};

export default App;
