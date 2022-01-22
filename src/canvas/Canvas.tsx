// React Flow:
// https://reactflow.dev/docs/api/component-props/
// https://github.com/wbkd/react-flow/blob/main/src/types/index.ts

// Jade
// https://dragonman225.js.org/jade.html

// TLDraw
// https://www.tldraw.com/
// https://github.com/tldraw/tldraw

// https://github.com/tldraw/tldraw/blob/dd1fb7387699a74694fb57394a09c7ed9772850d/packages/core/src/hooks/useCanvasEvents.tsx#L4


import { createContext, createSignal, PropsWithChildren } from "solid-js";
import { StoreSetter } from "solid-js/store";
import { Signal } from "solid-js/types/reactive/signal";

import "./canvas.css";

type Props = {
  // State
  // TODO: Make these optional and use local state if not provided
  selection: Signal<Map<any, HTMLDivElement>>;
  focus: Signal<[any, HTMLDivElement] | undefined>;
  camera: Signal<{ x: number; y: number; scale: number }>;

  // Options
  multiSelect?: boolean;

  // Pointer Events
  onPointerPress?: (event: PointerEvent) => void;
  onPointerDragStart?: (event: PointerEvent) => void;
  onPointerRelease?: (event: PointerEvent) => void;

  // Node Events
  onNodePointerOver?: (node: any, event: PointerEvent) => void;
  onNodeDragStart?: (node: any, event: PointerEvent) => void;
  onNodeDragEnd?: (node: any, event: PointerEvent) => void;

  transformNode?: (node: any, position: StoreSetter<{ x: number; y: number }>) => void;

  // Selection Events
  onSelectionChange?: (nodes: any) => void;
  onSelectionDragStart?: (nodes: any, event: PointerEvent) => void;
  onSelectionDrag?: (nodes: any, event: PointerEvent) => void;
  onSelectionDragEnd?: (nodes: any, event: PointerEvent) => void;

  //  Camera Events
  onMoveStart?: (camera: { x: number; y: number; scale: number }) => void;
  onMove?: (camera: { x: number; y: number; scale: number }) => void;
  onMoveEnd?: (camera: { x: number; y: number; scale: number }) => void;
};

let focusedCache: [any, HTMLDivElement] | undefined;
let selectionCache: Map<any, HTMLDivElement>;

export const CanvasContext = createContext<Props>({} as any);

function Canvas(props: PropsWithChildren<Props>) {
  const [_selection, setSelection] = props.selection;
  const [focus, setFocus] = props.focus;
  const [camera, setCamera] = props.camera;
  const [dragging, setDragging] = createSignal(false);

  function select(focused: [any, HTMLDivElement] | undefined) {
    if (focused) return new Map([focused]);
    return setSelection(new Map());
  }

  function handlePointerOver(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    setFocus(undefined);
  }

  function handlePointerDown(event: PointerEvent) {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    focusedCache = focus();
    selectionCache = setSelection(select(focusedCache));
  }

  function handlePointerMove(event: PointerEvent) {
    if (!dragging()) {
      setDragging(true);
      props.onPointerDragStart?.(event);
      return;
    }

    switch (event.buttons) {
      case 1:
        if (!selectionCache) return;
        props.onSelectionDrag?.(selectionCache, event);
        for (const [node] of selectionCache) {
          props.transformNode?.(node, (position) => ({
            x: position.x + event.movementX,
            y: position.y + event.movementY,
          }));
        }
        return;
      case 4:
        setCamera((c) => ({
          x: c.x + event.movementX,
          y: c.y + event.movementY,
          scale: c.scale,
        }));
        props.onMove?.(camera());
    }
  }

  function handlePointerUp(event: PointerEvent) {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    setDragging(false);
    props.onPointerRelease?.(event);

    if (!selectionCache) return;
    props.onSelectionDragEnd?.(selectionCache, event);
  }

  return (
    <div
      id="canvas"
      onPointerOver={handlePointerOver}
      onPointerDown={handlePointerDown}
    >
      <CanvasContext.Provider value={props}>
        {props.children}
      </CanvasContext.Provider>
    </div>
  );
}

export default Canvas;
