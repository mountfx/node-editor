/* --- Utils --- */
import { Component, For } from "solid-js";

/* --- Nodes --- */
import { createEditor } from "./node_editor/store";
import { defaultNodes, defaultSchema } from "./node_editor/nodes";
import Node from "./node_editor/Node";
import type { LtnNode } from "./node_editor/store.types";

/* --- Canvas --- */
import { createSelection } from "./canvas/createSelection";
import { createCamera } from "./canvas/createCamera";
import { createFocus } from "./canvas/createFocus";
import Canvas from "./canvas/Canvas";
import CanvasNode from "./canvas/CanvasNode";

export const schema = {
  multiply: {
    inputs: {
      a: { value: 0 },
      b: { value: 0 },
    },
    outputs: {
      product: 0,
    },
  },
};

export const [editor, { addNode, removeNode, useNode }] = createEditor({
  ...schema,
  ...defaultSchema,
});

const App: Component = () => {
  const camera = createCamera();
  const focus = createFocus<LtnNode | null>(null);

  // TODO: Make selection a map of any and HTMLDivElement
  // createSignal<Map<LtnNode, HTMLDivElement>>();
  const selection = createSelection<LtnNode>();

  return (
    <>
      <div style={{ position: "absolute", "z-index": 1 }}>
        <button onClick={() => console.log(editor)}>Log</button>
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
          transform: (node, position) => useNode(node).setPosition(position),
        }}
      >
        <For each={Object.values(editor)}>
          {(node) => (
            <CanvasNode id={node} focus={focus} position={node.position}>
              <Node node={node} components={{ ...defaultNodes }} />
            </CanvasNode>
          )}
        </For>
      </Canvas>
    </>
  );
};

export default App;
