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
  const [state, setState] = createSignal<"IDLE" | "PRESSING" | "DRAGGING">("IDLE");
  return [
    { state, selection, focus, origin },
    { setState, setSelection, setFocus, setOrigin },
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
let focusedCachePosition: { x: number; y: number };
let parentCachePosition: { x: number; y: number };
let selectionCache: Map<any, HTMLDivElement>;

export const CanvasContext = createContext<ReturnType<typeof createCanvas>>(
  [] as any
);

function Canvas(props: PropsWithChildren<Props>) {
  const canvas = createCanvas(props.origin, props.selection);
  const [
    { state, origin, focus },
    { setState, setOrigin, setFocus, setSelection },
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

    setState("PRESSING");
    focusedCache = focus();
    selectionCache = setSelection(select(focusedCache));

    if (!focusedCache) return;
    const rect = focusedCache[1].getBoundingClientRect();
    focusedCachePosition = { x: event.x - rect.x, y: event.y - rect.y };
  }

  function handlePointerMove(event: PointerEvent) {
    if (state() !== "DRAGGING") {
      setState("DRAGGING");
      // TODO: To generalize this and in order to allow reparenting,
      // we disable pointer events while pressing the mouse,
      // This way we can access the node beneath while dragging.
      parentCachePosition = { x: origin().x, y: origin().y };
      return;
    }

    switch (event.buttons) {
      case 1:
        if (!selectionCache) return;
        for (const [node] of selectionCache) {
          props.transformNode?.(node, {
            x: event.clientX - focusedCachePosition.x - parentCachePosition.x,
            y: event.clientY - focusedCachePosition.y - parentCachePosition.y,
          });
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

    setState("IDLE");

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
