/* --- Utils --- */
import { For, Component } from "solid-js";

// TODO: These methods needs to be passed down via props or by using context.
import { useNode, removeNode } from "../../App";
import type { LtnNode } from "../store.types";
// import Socket from "./Socket";

const DefaultNode: Component<{ node: LtnNode }> = (props) => {
  const { setInput } = useNode(props.node);

  return (
    <>
      <p>{props.node.kind}</p>
      <button onClick={() => removeNode(props.node.id)}>X</button>
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
