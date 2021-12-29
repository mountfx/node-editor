import { For, Component } from "solid-js";
import { Node as NodeType } from "./nodes.types";

import { createEditor } from "./nodes";

import Node from "./Node";
import { setMouseX, setMouseY } from "./state";

const App: Component = () => {
  const [editor, { createNode, removeNode }] = createEditor();

  function handleMouseDown(e: MouseEvent) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  function handleMouseMove(e: MouseEvent) {
    setMouseX(x => x + e.movementX);
    setMouseY(y => y + e.movementY);
  };

  function handleMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div id="editor" onMouseDown={handleMouseDown}>
      <button onClick={() => console.log(editor)}>Log</button>
      <button onClick={() => createNode("add")}>Add Add Node</button>
      <button onClick={() => createNode("subtract")}>Add Subtract Node</button>
      <button onClick={() => createNode("multiply")}>Add Multiply Node</button>
      <For each={Object.values(editor)}>
        {(node: NodeType) => (
          <Node node={node} removeNode={removeNode} />
        )}
      </For>
    </div>
  );
};

export default App;