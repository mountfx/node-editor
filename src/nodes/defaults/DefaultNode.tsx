/* --- Utils --- */
import { For, Component, createEffect, useContext } from "solid-js";

// TODO: These methods needs to be passed down via props or by using context.
import { useNode, removeNode } from "../../App";
import type { LtnNode } from "../types";
import Socket from "../Socket";
import { CanvasContext } from "../../canvas";

const DefaultNode: Component<{ node: LtnNode }> = (props) => {
  const { setInput, setOutput, computeOutput } = useNode(props.node);

  for (const output in props.node.outputs) {
    createEffect(() => {
      const result = computeOutput(output);
      if (result !== undefined) setOutput(output, result);
    });
  }

  const [_, { setSelection }] = useContext(CanvasContext);
  function remove() {
    setSelection(new Map());
    removeNode(props.node.id);
  }

  return (
    <>
      <p>{props.node.kind}</p>
      <button onClick={remove}>X</button>
      <div class="inputs">
        <For each={Object.keys(props.node.inputs || {})}>
          {(key) => (
            <div>
              {/* <Socket /> */}
              <label for={`${props.node.id}_input_${key}`}>{key}</label>
              <input
                type="number"
                id={`${props.node.id}_input_${key}`}
                readonly={Boolean(props.node.inputs?.[key].source)}
                disabled={Boolean(props.node.inputs?.[key].source)}
                value={props.node.inputs?.[key].value}
                onInput={(e) => setInput(key, Number(e.currentTarget.value))}
              />
            </div>
          )}
        </For>
      </div>
      <div class="outputs">
        <For
          each={
            Object.keys(props.node.outputs || {}) as [
              keyof typeof props.node.outputs
            ]
          }
        >
          {(key) => (
            <p>
              {key}: {props.node.outputs?.[key]}
            </p>
          )}
        </For>
      </div>
    </>
  );
};

export default DefaultNode;
