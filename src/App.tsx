import { For, Component } from "solid-js";
import { createEditor, Node as NodeType } from "./nodes";

import Node from "./Node";

const App: Component = () => {
  const [editor, { createNode, removeNode }] = createEditor();
  return (
    <>
      <button onClick={() => console.log(editor)}>Log</button>
      <button onClick={() => createNode("add")}>Add</button>
      <For each={Object.values(editor)}>
        {(node: NodeType) => (
          <Node node={node} removeNode={removeNode} />
        )}
      </For>
    </>
  );
};

export default App;