// React Flow:
// https://reactflow.dev/docs/api/component-props/
// https://github.com/wbkd/react-flow/blob/main/src/types/index.ts

// Jade
// https://dragonman225.js.org/jade.html

// TLDraw
// https://www.tldraw.com/
// https://github.com/tldraw/tldraw

// https://github.com/tldraw/tldraw/blob/dd1fb7387699a74694fb57394a09c7ed9772850d/packages/core/src/hooks/useCanvasEvents.tsx#L4

import { createContext, type PropsWithChildren, type Signal } from "solid-js";
import { type StoreSetter } from "solid-js/store";
import { createCanvas } from ".";

import "./canvas.css";

type Position = { x: number; y: number };
type Props = {
  // State
  origin?: Signal<{ x: number; y: number; scale: number }>;
  focus?: Signal<[any, HTMLDivElement]>;
  selection?: Signal<Map<any, HTMLDivElement>>;

  // Actions
  transformNode?: (node: any, position: StoreSetter<Position>) => void;
};

let active: [any, HTMLDivElement] | undefined;
let activePosition: Position;
let parentPosition: Position;
let initialSelection: Map<any, HTMLDivElement>;

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

    active = focus();
    initialSelection = setSelection(select(active));

    active ? setState("POINTING_BOUNDS") : setState("POINTING_CANVAS");

    if (!active) return;
    const rect = active[1].getBoundingClientRect();
    activePosition = { x: event.x - rect.x, y: event.y - rect.y };
  }

  function handlePointerMove(event: PointerEvent) {
    if (state() !== "TRANSLATING") {
      setState("TRANSLATING");

      // TODO: To generalize this and in order to allow reparenting,
      // we disable pointer events while pressing the mouse,
      // This way we can access the node beneath while dragging.
      parentPosition = { x: origin().x, y: origin().y };
      
      return;
    }

    switch (event.buttons) {
      case 1:
        if (!initialSelection) return;
        for (const [node] of initialSelection) {
          props.transformNode?.(node, {
            x: Math.round(event.clientX - activePosition.x - parentPosition.x),
            y: Math.round(event.clientY - activePosition.y - parentPosition.y),
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
