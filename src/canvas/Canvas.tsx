// React Flow:
// https://reactflow.dev/docs/api/component-props/
// https://github.com/wbkd/react-flow/blob/main/src/types/index.ts

// Jade
// https://dragonman225.js.org/jade.html

// TLDraw
// https://www.tldraw.com/
// https://github.com/tldraw/tldraw

// https://github.com/tldraw/tldraw/blob/dd1fb7387699a74694fb57394a09c7ed9772850d/packages/core/src/hooks/useCanvasEvents.tsx#L4

import { createContext, createSignal, PropsWithChildren, createEffect } from "solid-js";
import { StoreSetter } from "solid-js/store";
import { Signal } from "solid-js/types/reactive/signal";

import "./canvas.css";

function createCanvas(
  initialOrigin?: Signal<{ x: number; y: number; scale: number }>,
  initialSelection?: Signal<Map<any, HTMLDivElement>>
) {
  const [origin, setOrigin] =
    initialOrigin || createSignal({ x: 0, y: 0, scale: 1 });
  const [selection, setSelection] =
    initialSelection || createSignal<Map<any, HTMLDivElement>>(new Map());
  const [focus, setFocus] = createSignal<[any, HTMLDivElement] | undefined>(
    undefined
  );
  const [pressed, setPressed] = createSignal(false);
  const [dragging, setDragging] = createSignal(false);
  return [
    { selection, focus, origin, pressed, dragging },
    { setSelection, setFocus, setOrigin, setPressed, setDragging },
  ] as const;
}

type Props = {
  // State
  origin?: Signal<{ x: number; y: number; scale: number }>;
  focus?: Signal<[any, HTMLDivElement]>;
  selection?: Signal<Map<any, HTMLDivElement>>;

  // Actions
  transformNode?: (
    node: any,
    position: StoreSetter<{ x: number; y: number }>
  ) => void;
};

let focusedCache: [any, HTMLDivElement] | undefined;
let focusedCacheRect: { x: number; y: number };
let selectionCache: Map<any, HTMLDivElement>;

export const CanvasContext = createContext<ReturnType<typeof createCanvas>>(
  [] as any
);

function Canvas(props: PropsWithChildren<Props>) {
  const canvas = createCanvas(props.origin, props.selection);
  const [
    { focus, dragging },
    { setOrigin, setFocus, setSelection, setPressed, setDragging },
  ] = canvas;

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

    setPressed(true);
    focusedCache = focus();
    selectionCache = setSelection(select(focusedCache));

    if (!focusedCache) return;
    const rect = focusedCache[1].getBoundingClientRect();
    focusedCacheRect = { x: event.x - rect.x, y: event.y - rect.y };
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
            x: event.clientX - focusedCacheRect.x,
            y: event.clientY - focusedCacheRect.y,
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

    setPressed(false);
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
