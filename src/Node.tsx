import { For, Component, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Node, Node as NodeType } from "./nodes";

import "./node.css";
import AddNode from "./AddNode";

const Node: Component<{ node: NodeType, removeNode: Function }> = props => {
  const [node, { setInputValue, getInput }] = props.node;

  let ref: HTMLDivElement | undefined = undefined;

  const kind: Record<string, Component<{ node: Node }>> = {
    add: AddNode,
  };

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
      <button onClick={() => props.removeNode(node.id)}>X</button>
      <div class="inputs">
        <For each={Object.entries(node.inputs || {})}>
          {([socket, input]) => (
            <div class="input">
              <div class="socket"></div>
              <label for={`${node.id}_input_${socket}`}>{socket}</label>
              <input
                type="number"
                id={`${node.id}_input_${socket}`}
                name={socket}
                readonly={input.source ? true : false}
                value={getInput(socket)}
                onInput={e => setInputValue(socket, Number(e.currentTarget.value))} />
            </div>
          )}
        </For>
      </div>
      <Dynamic component={kind[node.kind]} node={props.node} />
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
};

export default Node;