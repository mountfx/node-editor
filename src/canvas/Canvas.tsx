// React Flow:
// https://reactflow.dev/docs/api/component-props/
// https://github.com/wbkd/react-flow/blob/main/src/types/index.ts

// Jade
// https://dragonman225.js.org/jade.html

// TLDraw
// https://www.tldraw.com/
// https://github.com/tldraw/tldraw

import { createContext, createSignal, PropsWithChildren } from "solid-js";
import { StoreSetter } from "solid-js/store";
import { Signal } from "solid-js/types/reactive/signal";

import "./canvas.css";

type Props = {
  // State
  // TODO: Make these optional and use local state if not provided
  selection: Signal<Map<any, HTMLDivElement>>;
  focus: Signal<[any, HTMLDivElement] | null>;
  camera: Signal<{ x: number; y: number; scale: number }>;

  // Options
  multiSelect?: boolean;

  // Mouse Events
  onMousePress?: (event: MouseEvent) => void;
  onMouseDragStart?: (event: MouseEvent) => void;
  onMouseRelease?: (event: MouseEvent) => void;

  // Node Events
  onNodeMouseOver?: (node: any, event: MouseEvent) => void;
  onNodeDragStart?: (node: any, event: MouseEvent) => void;
  onNodeDragEnd?: (node: any, event: MouseEvent) => void;

  transformNode?: (node: any, position: StoreSetter<{ x: number; y: number }>) => void;

  // Selection Events
  onSelectionChange?: (nodes: any) => void;
  onSelectionDragStart?: (nodes: any, event: MouseEvent) => void;
  onSelectionDrag?: (nodes: any, event: MouseEvent) => void;
  onSelectionDragEnd?: (nodes: any, event: MouseEvent) => void;

  //  Camera Events
  onMoveStart?: (camera: { x: number; y: number; scale: number }) => void;
  onMove?: (camera: { x: number; y: number; scale: number }) => void;
  onMoveEnd?: (camera: { x: number; y: number; scale: number }) => void;
};

let focusedCache: [any, HTMLDivElement] | null;
let selectionCache: Map<any, HTMLDivElement>;

export const CanvasContext = createContext<Props>({} as any);

function Canvas(props: PropsWithChildren<Props>) {
  const [_selection, setSelection] = props.selection;
  const [focus, setFocus] = props.focus;
  const [camera, setCamera] = props.camera;
  const [dragging, setDragging] = createSignal(false);

  function select(focused: [any, HTMLDivElement] | null) {
    if (focused) return new Map([focused]);
    return setSelection(new Map());
  }

  function handleMouseOver(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setFocus(null);
  }

  function handleMouseDown(event: MouseEvent) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    focusedCache = focus();
    selectionCache = setSelection(select(focusedCache));
  }

  function handleMouseMove(event: MouseEvent) {
    if (!dragging()) {
      setDragging(true);
      props.onMouseDragStart?.(event);
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

  function handleMouseUp(event: MouseEvent) {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    setDragging(false);
    props.onMouseRelease?.(event);

    if (!selectionCache) return;
    props.onSelectionDragEnd?.(selectionCache, event);
  }

  return (
    <div
      id="canvas"
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
    >
      <CanvasContext.Provider value={props}>
        {props.children}
      </CanvasContext.Provider>
    </div>
  );
}

export default Canvas;
