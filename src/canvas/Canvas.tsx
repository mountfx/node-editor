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

function createCanvas(
  initialSelection?: Signal<Map<any, HTMLDivElement>>,
  initialFocus?: Signal<[any, HTMLDivElement] | undefined>,
  initialOrigin?: Signal<{ x: number; y: number; scale: number }>
) {
  const [selection, setSelection] = initialSelection || createSignal(new Map());
  const [focus, setFocus] = initialFocus || createSignal(undefined);
  const [origin, setOrigin] =
    initialOrigin || createSignal({ x: 0, y: 0, scale: 1 });
  const [pressed, setPressed] = createSignal(false);
  const [dragging, setDragging] = createSignal(false);
  return [
    { selection, focus, origin, pressed, dragging },
    { setSelection, setFocus, setOrigin, setPressed, setDragging },
  ] as const;
}

type Props = {
  // State
  selection?: Signal<Map<any, HTMLDivElement>>;
  focus?: Signal<[any, HTMLDivElement] | undefined>;
  camera?: Signal<{ x: number; y: number; scale: number }>;

  // Actions
  transformNode?: (
    node: any,
    position: StoreSetter<{ x: number; y: number }>
  ) => void;
};

let focusedCache: [any, HTMLDivElement] | undefined;
let selectionCache: Map<any, HTMLDivElement>;

export const CanvasContext = createContext<ReturnType<typeof createCanvas>>([] as any);

function Canvas(props: PropsWithChildren<Props>) {
  const canvas = createCanvas(props.selection, props.focus, props.camera);
  const [{ focus, dragging }, { setOrigin, setFocus, setSelection, setDragging }] = canvas;

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
      return;
    }

    switch (event.buttons) {
      case 1:
        if (!selectionCache) return;
        for (const [node] of selectionCache) {
          props.transformNode?.(node, (position) => ({
            x: position.x + event.movementX,
            y: position.y + event.movementY,
          }));
        }
        return;
      case 4:
        setOrigin((o) => ({
          x: o.x + event.movementX,
          y: o.y + event.movementY,
          scale: o.scale,
        }));
    }
  }

  function handlePointerUp(event: PointerEvent) {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    setDragging(false);

    if (!selectionCache) return;
  }

  return (
    <div
      id="canvas"
      onPointerOver={handlePointerOver}
      onPointerDown={handlePointerDown}
    >
      <CanvasContext.Provider value={canvas}>
        {props.children}
      </CanvasContext.Provider>
    </div>
  );
}

export default Canvas;
