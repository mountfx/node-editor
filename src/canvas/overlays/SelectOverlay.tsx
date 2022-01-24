import { Component, For, useContext } from "solid-js";
import { CanvasContext } from "../Canvas";

import "./overlay.css";

const SelectOverlay: Component = () => {
  const [{ selection }] = useContext(CanvasContext);
  return (
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
  );
};

export default SelectOverlay;
