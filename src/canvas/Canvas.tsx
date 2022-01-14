/* --- Utils --- */
import { PropsWithChildren } from "solid-js";
import { StoreSetter } from "solid-js/store";
import { withinThreshold } from "../utils";

/* --- Canvas --- */
import type { Camera } from "./camera";
import type { Focus } from "./focus";
import type { Selection } from "./selection";

/* --- CSS --- */
import "./canvas.css";

type Props<T> = {
  camera: Camera;
  focus: Focus<T>;
  selection: Selection<T>;
  methods: {
    transform: (id: T, position: StoreSetter<{ x: number; y: number }>) => void;
  };
};

function Canvas<T>(props: PropsWithChildren<Props<T>>) {
  const [{ position }, { transform }] = props.camera;
  const [focused, { focus }] = props.focus;
  const [selected, { select }] = props.selection;

  /* --- Cache --- */
  let focusedNodeCache: [T, HTMLDivElement] | null;
  let selectedNodeCache: T[];
  let dragStartPosition: { x: number; y: number };
  let dragging = false;

  /* --- Mouse Over Event --- */
  function handleMouseOver(e: MouseEvent) {
    focus(null);
  }

  /* --- Mouse Down Event --- */
  function handleMouseDown(e: MouseEvent) {
    if (e.buttons === 4) e.preventDefault();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    dragStartPosition = { x: e.clientX, y: e.clientY };

    focusedNodeCache = focused();
    if (focusedNodeCache) {
      select([focusedNodeCache[0]]);
    } else {
      select([]);
    }
    selectedNodeCache = selected();
  }

  /* --- Mouse Move Event --- */
  function handleMouseMove(e: MouseEvent) {
    // Drag only if the mouse has moved more than the threshold
    // Return early if the mouse hasn't moved
    if (!dragging) {
      if (
        !withinThreshold(e.clientX, dragStartPosition.x, 4) ||
        !withinThreshold(e.clientY, dragStartPosition.y, 4)
      ) {
        dragging = true;
      }
      return;
    }

    if (e.buttons === 1) {
      for (const node of selectedNodeCache) {
        props.methods.transform(node, ({ x, y }) => {
          return {
            x: x + e.movementX,
            y: y + e.movementY,
          };
        });
      }
      return;
    }

    if (e.buttons !== 4) return;
    transform(({ x, y }) => ({ x: x + e.movementX, y: y + e.movementY }));
  }

  /* --- Mouse Up Event --- */
  function handleMouseUp() {
    dragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div
      id="canvas"
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
    >
      <div
        id="origin"
        style={{ transform: `translate(${position().x}px, ${position().y}px)` }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Canvas;
