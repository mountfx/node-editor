/* --- Utils --- */
import { Component, For } from "solid-js";

/* --- Nodes --- */
import { createNodes } from "./nodes";
import { defaultNodes, defaultSchema } from "./nodes/default";
import Node from "./nodes/Node";
import type { LtnNode } from "./nodes/types";

/* --- Canvas --- */
import { createSelection } from "./canvas/selection";
import { createCamera } from "./canvas/camera";
import { createFocus } from "./canvas/focus";
import Canvas from "./canvas/Canvas";
import CanvasNode from "./canvas/CanvasNode";

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
  const camera = createCamera();
  const focus = createFocus<LtnNode>(null);

  // TODO: Make selection a map of any and HTMLDivElement
  // createSignal<Map<LtnNode, HTMLDivElement>>();
  const selection = createSelection<LtnNode>();

  return (
    <>
      <div style={{ position: "absolute", "z-index": 1 }}>
        <button onClick={() => console.log(nodes)}>Log</button>
        <button onClick={() => console.log(JSON.stringify(nodes, null, 2))}>Log Raw</button>
        <button onClick={() => addNode("add")}>Add Add Node</button>
        <button onClick={() => addNode("subtract")}>Add Subtract Node</button>
        <button onClick={() => addNode("multiply")}>
          Add Multiply Node (Custom)
        </button>
        <button onClick={() => addNode("divide")}>Add Divide Node</button>
      </div>
      <Canvas
        camera={camera}
        focus={focus}
        selection={selection}
        methods={{
          transform: (node, position) =>
            useNode(node).setContext("position", position),
        }}
      >
        <For each={Object.values(nodes)}>
          {(node) => (
            <CanvasNode
              id={node}
              focus={focus}
              position={node.context?.position}
            >
              <Node node={node} components={{ ...defaultNodes }} />
            </CanvasNode>
          )}
        </For>
      </Canvas>
    </>
  );
};

export default App;
