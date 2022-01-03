import { For, Component } from "solid-js";
import { Node as NodeType } from "./nodes.types";

import { createEditor } from "./nodes";

import Node from "./Node";

const App: Component = () => {
  const [editor, { createNode, removeNode }] = createEditor();

  return (
    <div id="editor">
      <button onClick={() => console.log(editor)}>Log</button>
      <button onClick={() => createNode("add")}>Add Add Node</button>
      <button onClick={() => createNode("subtract")}>Add Subtract Node</button>
      <button onClick={() => createNode("multiply")}>Add Multiply Node</button>
      <button onClick={() => createNode("position")}>Add Position Node</button>
      <button onClick={() => createNode("yolo")}>Add Yolo Node</button>
      <For each={Object.values(editor)}>
        {(node: NodeType) => <Node node={node} removeNode={removeNode} />}
      </For>
    </div>
  );
};

export default App;