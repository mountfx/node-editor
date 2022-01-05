import { For, type Component } from "solid-js";

import { createNodes } from "./nodes/createNodes";
import type { Node as NodeType } from "./nodes/nodes.types";

// import Node from "./Node";
import Node from "./nodes/Node";

// CANVAS
import { createSelection } from "./canvas/createSelection";
import { createCamera } from "./canvas/createCamera";
import { createFocus } from "./canvas/createFocus";
import Canvas from "./canvas/Canvas";
import CanvasNode from "./canvas/CanvasNode";

const App: Component = () => {
  const [editor, { createNode, removeNode }] = createNodes();

  const camera = createCamera();
  const focus = createFocus<NodeType | null>(null);
  const selection = createSelection<NodeType>();

  return (
    <div id="editor">
      <button onClick={() => console.log(editor)}>Log</button>
      <button onClick={() => createNode("add")}>Add Add Node</button>
      <button onClick={() => createNode("subtract")}>Add Subtract Node</button>
      <button onClick={() => createNode("multiply")}>Add Multiply Node</button>
      <button onClick={() => createNode("divide")}>Add Divide Node</button>
      <Canvas
        camera={camera}
        focus={focus}
        selection={selection}
        methods={{
          transform: ([_, { setPosition }], position) => setPosition(position),
        }}
      >
        <For each={Object.values(editor)}>
          {(node) => (
            <CanvasNode node={node} focus={focus}>
              <Node node={node} removeNode={removeNode} />
            </CanvasNode>
          )}
        </For>
      </Canvas>
    </div>
  );
};

export default App;
