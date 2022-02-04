import { createSignal, type Signal } from "solid-js";
import Canvas, { CanvasContext } from "./Canvas";
import CanvasNode from "./CanvasNode";
import Origin from "./Origin";
import SelectOverlay from "./overlays/SelectOverlay";

function createCanvas(
  initialOrigin?: Signal<{ x: number; y: number; scale: number }>,
  initialSelection?: Signal<Map<any, HTMLDivElement>>
) {
  const [origin, setOrigin] =
    initialOrigin || createSignal({ x: 0, y: 0, scale: 1 });
  const [draggable, setDraggable] = createSignal(false);
  const [selection, setSelection] =
    initialSelection || createSignal<Map<any, HTMLDivElement>>(new Map());
  const [focus, setFocus] = createSignal<[any, HTMLDivElement] | undefined>(
    undefined
  );

  const [state, setState] = createSignal<
    | "IDLE"
    | "POINTING_CANVAS"
    | "POINTING_BOUNDS"
    | "POINTING_SOCKET"
    | "TRANSLATING"
    | "BRUSHING"
  >("IDLE");
  return [
    { state, selection, focus, origin, draggable },
    { setState, setSelection, setFocus, setOrigin, setDraggable },
  ] as const;
}

export {
  createCanvas,
  Canvas,
  CanvasContext,
  CanvasNode,
  Origin,
  SelectOverlay,
};
