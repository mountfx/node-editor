import { Component, For, Show, useContext } from "solid-js";
import { CanvasContext } from "../Canvas";

import "./overlay.css";

const SelectOverlay: Component = () => {
  const [{ selection, dragging }] = useContext(CanvasContext);
  return (
    <Show when={!dragging()}>
      <For each={[...selection().values()]}>
        {(el) => {
          const bounds = el.getBoundingClientRect();
          return (
            <div
              id="select"
              style={{
                transform: `translate(${bounds.x}px, ${bounds.y}px)`,
                width: bounds.width + "px",
                height: bounds.height + "px",
              }}
            ></div>
          );
        }}
      </For>
    </Show>
  );
};

export default SelectOverlay;
