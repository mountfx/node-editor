// React Flow
// https://reactflow.dev/docs/api/component-props/
// https://github.com/wbkd/react-flow/blob/main/src/types/index.ts

// Jade
// https://dragonman225.js.org/jade.html

// TLDraw
// https://www.tldraw.com/
// https://github.com/tldraw/tldraw
// https://github.com/tldraw/tldraw/blob/dd1fb7387699a74694fb57394a09c7ed9772850d/packages/core/src/hooks/useCanvasEvents.tsx#L4

import { createContext, createEffect, createSignal, type PropsWithChildren, type Signal } from "solid-js";

import "./canvas.css";

type Position = { x: number; y: number };
type Props = {
  // State
  origin?: Signal<{ x: number; y: number; scale: number }>;
  focus?: Signal<[any, HTMLDivElement]>;
  selection?: Signal<Map<any, HTMLDivElement>>;

  // Events
  onOver?: (event: PointerEvent) => void;
  onPress?: (event: PointerEvent) => void;
  onDragStart?: (event: PointerEvent) => void;
  onDrag?: (event: PointerEvent, delta: Position) => void;
  onDragEnd?: (event: PointerEvent) => void;
  onRelease?: (event: PointerEvent) => void;
};

let absoluteDragStartPosition: Position;
let dragging = false;

export const CanvasContext = createContext([] as any);

function Canvas(props: PropsWithChildren<Props>) {
  const [focus, setFocus] = createSignal<HTMLDivElement | undefined>(undefined);

  createEffect(( ) => console.dir(focus()?.innerText));

  function handlePointerOver(event: PointerEvent) {
    props.onOver?.(event);
    setFocus(undefined);
  }

  function handlePointerDown(event: PointerEvent) {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    absoluteDragStartPosition = { x: event.x, y: event.y };
    props.onPress?.(event);
  }

  function handlePointerMove(event: PointerEvent) {
    if (dragging) {
      const delta = {
        x: event.x - absoluteDragStartPosition.x,
        y: event.y - absoluteDragStartPosition.y,
      };
      return props.onDrag?.(event, delta);
    }
    dragging = true;
    props.onDragStart?.(event);
  }

  function handlePointerUp(event: PointerEvent) {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    if (dragging) {
      props.onDragEnd?.(event);
      dragging = false;
    }

    props.onRelease?.(event);
  }

  return (
    <div
      id="canvas"
      onPointerOver={handlePointerOver}
      onPointerDown={handlePointerDown}
    >
      <CanvasContext.Provider value={[{ focus }, { setFocus }]}>
        {props.children}
      </CanvasContext.Provider>
    </div>
  );
}

export default Canvas;
