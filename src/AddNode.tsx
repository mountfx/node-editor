import { For, Component, createEffect } from "solid-js";
import { Node } from "./nodes";

const AddNode: Component<{ node: Node }> = props => {
  const [node, { setOutput, getInput }] = props.node;

  createEffect(() => console.log(getInput("a")));

  createEffect(() => setOutput("sum", getInput("a") + getInput("b")));

  return (
    <div class="outputs">
      <For each={Object.entries(node.outputs || {})}>
        {([socket, output]) => <p><span>{socket}</span>{output}</p>}
      </For>
    </div>
  );
};

export default AddNode;