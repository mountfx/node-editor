// React Flow
// https://reactflow.dev/docs/api/component-props/
// https://github.com/wbkd/react-flow/blob/main/src/types/index.ts

// Jade
// https://dragonman225.js.org/jade.html

// TLDraw
// https://www.tldraw.com/
// https://github.com/tldraw/tldraw
// https://github.com/tldraw/tldraw/blob/dd1fb7387699a74694fb57394a09c7ed9772850d/packages/core/src/hooks/useCanvasEvents.tsx#L4

import {
  createContext,
  createSignal,
  type PropsWithChildren,
  type Signal,
} from "solid-js";
import { getRelativePosition } from "../utils";

import "./canvas.css";

type Position = { x: number; y: number };
type Props = {
  // State
  origin?: Signal<{ x: number; y: number; scale: number }>;
  focus?: Signal<[any, HTMLDivElement]>;
  selection?: Signal<Map<any, HTMLDivElement>>;

  // Events
  onPointerOver?: (event: PointerEvent) => void;
  onPointerPress?: (event: PointerEvent) => void;
  onPointerDragStart?: (event: PointerEvent) => void;
  onPointerDrag?: (event: PointerEvent, delta: Position) => void;
  onPointerDragEnd?: (event: PointerEvent) => void;
  onPointerRelease?: (event: PointerEvent) => void;

  onNodePress?: (node: any, event: PointerEvent) => void;
  onNodeDragStart?: (node: any, event: PointerEvent) => void;
  onNodeDrag?: (node: any, event: Position) => void;
  onNodeDragEnd?: (node: any, event: PointerEvent) => void;
  onNodeRelease?: (node: any, event: PointerEvent) => void;

  // Actions
};

let relativeStartPosition: Position;
let absoluteStartPosition: Position;
let dragging = false;
let focused: [any, HTMLDivElement] | undefined;

export const CanvasContext = createContext([] as any);

function Canvas(props: PropsWithChildren<Props>) {
  const [focus, setFocus] = createSignal<[any, HTMLDivElement] | undefined>(
    undefined
  );

  function handlePointerOver(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    props.onPointerOver?.(event);
    setFocus(undefined);
  }

  function handlePointerDown(event: PointerEvent) {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    absoluteStartPosition = { x: event.x, y: event.y };
    props.onPointerPress?.(event);

    focused = focus();
    if (!focused) return;
    const [node, ref] = focused;
    props.onNodePress?.(node, event);
    const rect = ref.getBoundingClientRect();
    relativeStartPosition = { x: event.x - rect.x, y: event.y - rect.y };
  }

  function handlePointerMove(event: PointerEvent) {
    if (dragging) {
      if (focused) {
        const [node] = focused;
        props.onNodeDrag?.(
          node,
          getRelativePosition(event, relativeStartPosition)
        );
      }
      return props.onPointerDrag?.(
        event,
        getRelativePosition(event, absoluteStartPosition)
      );
    }
    dragging = true;
    props.onPointerDragStart?.(event);
    if (focused) {
      const [node] = focused;
      props.onNodeDragStart?.(node, event);
    }
  }

  function handlePointerUp(event: PointerEvent) {
    if (dragging) {
      props.onPointerDragEnd?.(event);
      if (focused) {
        const [node] = focused;
        props.onNodeDragEnd?.(node, event);
      }
      dragging = false;
    }

    relativeStartPosition = { x: 0, y: 0 };

    props.onPointerRelease?.(event);
    if (focused) {
      const [node] = focused;
      props.onNodeRelease?.(node, event);
    }
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
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
