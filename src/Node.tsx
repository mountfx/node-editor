import { For, Component, createSignal, createMemo } from "solid-js";
import { Node as NodeType } from "./nodes.types";

import "./node.css";
import Edge from "./Edge";

const Node: Component<{ node: NodeType, removeNode: Function }> = props => {
  const [node, { setInputValue, setOutput, getInput }] = props.node;

  switch(node.kind) {
    case "add":
      setOutput("sum", createMemo(() => getInput("a") + getInput("b")));
      break;
    case "subtract":
      setOutput("difference", createMemo(() => getInput("a") - getInput("b")));
      break;
    case "multiply":
      setOutput("product", createMemo(() => getInput("a") * getInput("b")));
      break;
  };

  let ref: HTMLDivElement | undefined = undefined;

  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  function handleMouseDown(e: MouseEvent) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  function handleMouseMove(e: MouseEvent) {
    setX(x => x + e.movementX);
    setY(y => y + e.movementY);
  };

  function handleMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      class="node"
      style={{
      "transform": `translate(${ x() }px, ${ y() }px)`,
    }}>
      <p>{node.kind}</p>
      <button onClick={() => props.removeNode(node.id)}>X</button>
      <div class="inputs">
        <For each={Object.entries(node.inputs || {})}>
          {([socket, input]) => (
            <div class="input">
              <Edge node={props.node} socket={socket} />
              <label for={`${node.id}_input_${socket}`}>{socket}</label>
              <input
                type="number"
                id={`${node.id}_input_${socket}`}
                name="a"
                readonly={input.source !== null}
                disabled={input.source !== null}
                value={getInput(socket)}
                onInput={e => setInputValue(socket, Number(e.currentTarget.value))} />
            </div>
          )}
        </For>
      </div>
      <div class="outputs">
        <For each={Object.entries(node.outputs || {})}>
          {([socket, output]) => (
            <p><span>{socket}</span>{output}</p>
          )}
        </For>
      </div>
    </div>
  );
};

export default Node;