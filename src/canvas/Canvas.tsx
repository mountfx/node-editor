import { Component } from "solid-js";
import { StoreSetter } from "solid-js/store";
import { Node } from "../nodes/nodes.types";
import { Camera } from "./createCamera";
import { Focus } from "./createFocus";
import { Selection } from "./createSelection";

const Canvas: Component<{
  camera: Camera;
  focus: Focus<Node | null>;
  selection: Selection<Node>;
  methods: {
    transform: (
      node: Node,
      position: StoreSetter<{ x: number; y: number }>
    ) => void;
  };
}> = (props) => {
  const [{ position }, { transform }] = props.camera;
  const [focused, { focus }] = props.focus;
  const [selected, { select }] = props.selection;

  let focusedNodeCache: Node | null = null;

  function handleMouseOver(e: MouseEvent) {
    focus(null);
  }

  function handleMouseDown(e: MouseEvent) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    focusedNodeCache = focused();
    if (focusedNodeCache) return select([focusedNodeCache]);
    return select([]);
  }

  function handleMouseMove(e: MouseEvent) {
    if (e.buttons === 1) {
      for (const node of selected()) {
        props.methods.transform(node, ({ x, y }) => ({
          x: x + e.movementX,
          y: y + e.movementY,
        }));
      }
      return;
    }
    if (e.buttons !== 4) return;
    transform(({ x, y }) => ({ x: x + e.movementX, y: y + e.movementY }));
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div
      id="canvas"
      style={{
        height: "600px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid black",
      }}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
    >
      <div
        id="origin"
        style={{
          position: "absolute",
          transform: `translate(${position().x}px, ${position().y}px)`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Canvas;
