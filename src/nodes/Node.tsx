import { For, Component, createMemo } from "solid-js";
import { Node as NodeType } from "./nodes.types";

import "./node.css";

const Node: Component<{ node: NodeType; removeNode: Function }> = (props) => {
  const [node, { setInputValue, setOutput, getInput, getInputs }] = props.node;

  const { a, b } = getInputs();

  switch (node.kind) {
    case "add":
      setOutput(
        "sum",
        createMemo(() => a() + b())
      );
      break;
    case "subtract":
      setOutput(
        "difference",
        createMemo(() => a() - b())
      );
      break;
    case "multiply":
      setOutput(
        "product",
        createMemo(() => a() * b())
      );
      break;
    case "divide":
      setOutput(
        "quotient",
        createMemo(() => a() / b())
      );
      break;
  }

  return (
    <div
      class="node"
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      }}
    >
      <p>{node.kind}</p>
      <button onClick={() => props.removeNode(node.id)}>X</button>
      <div class="inputs">
        <For each={Object.entries(node.inputs || {})}>
          {([socket, input]) => (
            <div class="input">
              <label for={`${node.id}_input_${socket}`}>{socket}</label>
              <input
                type="number"
                id={`${node.id}_input_${socket}`}
                name={socket}
                readonly={input.source !== null}
                disabled={input.source !== null}
                value={getInput(socket)}
                onInput={(e) =>
                  setInputValue(socket, Number(e.currentTarget.value))
                }
              />
            </div>
          )}
        </For>
      </div>
      <div class="outputs">
        <For each={Object.entries(node.outputs || {})}>
          {([socket, output]) => (
            <p>
              <span>{socket}</span>
              {output}
            </p>
          )}
        </For>
      </div>
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
};

export default Node;
