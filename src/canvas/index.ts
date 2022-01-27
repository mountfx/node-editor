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
  const [selection, setSelection] =
    initialSelection || createSignal<Map<any, HTMLDivElement>>(new Map());
  const [focus, setFocus] = createSignal<[any, HTMLDivElement] | undefined>(
    undefined
  );

  const [state, setState] = createSignal<
    "IDLE" | "POINTING_CANVAS" | "POINTING_BOUNDS" | "TRANSLATING" | "BRUSHING"
  >("IDLE");
  return [
    { state, selection, focus, origin },
    { setState, setSelection, setFocus, setOrigin },
  ] as const;
}

export { createCanvas, Canvas, CanvasContext, CanvasNode, Origin, SelectOverlay };
