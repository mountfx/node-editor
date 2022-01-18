import { createContext, createSignal, PropsWithChildren } from "solid-js";
import { StoreSetter } from "solid-js/store";
import { inRange } from "../utils";

import "./canvas.css";

function createCanvas() {
  const [cameraPosition, setCameraPosition] = createSignal({ x: 0, y: 0 });
  const [cameraScale, setCameraScale] = createSignal(1);
  const [focus, setFocus] = createSignal(null);
  const [selection, setSelection] = createSignal<Map<any, HTMLDivElement>>(
    new Map()
  );
  const [dragging, setDragging] = createSignal(false);

  return [
    {
      camera: {
        position: cameraPosition,
        scale: cameraScale,
      },
      focus,
      selection,
      dragging,
    },
    {
      setCameraPosition,
      setCameraScale,
      setFocus,
      setSelection,
      setDragging,
    },
  ] as const;
}

export const CanvasContext = createContext<ReturnType<typeof createCanvas>>(
  [] as any
);

type Props = {
  camera?: {
    position: { x: number; y: number };
    scale: number;
  };
  focus?: [any, HTMLDivElement] | null;
  selection?: Map<any, HTMLDivElement>;
  transform?: (
    node: any,
    position: StoreSetter<{ x: number; y: number }>
  ) => void;
};

function Canvas<T extends PropsWithChildren<Props>>(props: T) {
  /* ---- State ---- */

  const store = createCanvas();
  const [
    { focus, dragging },
    { setCameraPosition, setFocus, setSelection, setDragging },
  ] = store;

  /* ---- Cache ---- */

  let focusedNodeCache: [any, HTMLDivElement] | null;
  let selectedNodeCache: Map<any, HTMLDivElement>;
  let dragStartPosition: { x: number; y: number };

  /* ---- Helper ---- */

  function select(focused: [any, HTMLDivElement] | null) {
    if (focused) return new Map([focused]);
    return setSelection(new Map());
  }

  function getTransformedNode(
    position: { x: number; y: number },
    e: MouseEvent
  ) {
    return {
      x: position.x + e.movementX,
      y: position.y + e.movementY,
    };
  }

  function getTransformedCamera(
    position: { x: number; y: number },
    e: MouseEvent
  ) {
    return {
      x: position.x + e.movementX,
      y: position.y + e.movementY,
    };
  }

  /* ---- Events ---- */

  function handleMouseOver(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setFocus(null);
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.buttons === 4) e.preventDefault();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    dragStartPosition = { x: e.x, y: e.y };
    focusedNodeCache = focus();
    selectedNodeCache = setSelection(select(focusedNodeCache));
  }

  function handleMouseMove(e: MouseEvent) {
    if (!dragging()) {
      if (
        !inRange(e.x, dragStartPosition.x, 4) ||
        !inRange(e.y, dragStartPosition.y, 4)
      ) {
        setDragging(true);
      }
      return;
    }

    if (e.buttons === 1) {
      for (const [node] of selectedNodeCache) {
        props.transform?.(node, (position) => getTransformedNode(position, e));
      }
      return;
    }

    if (e.buttons !== 4) return;
    setCameraPosition((position) => getTransformedCamera(position, e));
  }

  function handleMouseUp() {
    setDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div
      id="canvas"
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
    >
      <CanvasContext.Provider value={store}>
        {props.children}
      </CanvasContext.Provider>
    </div>
  );
}

export default Canvas;
