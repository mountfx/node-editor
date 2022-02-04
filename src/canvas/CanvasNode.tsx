import { createSignal, useContext, type PropsWithChildren } from "solid-js";
import { CanvasContext } from ".";

let pointerDown: PointerEvent;
let nodeStartPosition: { x: number; y: number };
let parentPosition: { x: number; y: number };

function getPosition(node: HTMLElement | null | undefined) {
  return node?.getBoundingClientRect() || { x: 0, y: 0 };
}

function CanvasNode<T = any>(
  props: PropsWithChildren<{
    node: T;
    position: { x: number; y: number };

    onPress?: (event: PointerEvent) => void;
    onDragStart?: (event: PointerEvent) => void;
    onDrag?: (event: PointerEvent, delta: { x: number; y: number }) => void;
    onDragEnd?: (event: PointerEvent) => void;
    onRelease?: (event: PointerEvent) => void;
  }>
) {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [dragging, setDragging] = createSignal(false);
  const [_, { setFocus }] = useContext(CanvasContext);

  function handlePointerEnter(event: PointerEvent) {
    setFocus(ref());
  }

  function handlePointerDown(event: PointerEvent) {
    event.stopImmediatePropagation();

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    pointerDown = event;
    nodeStartPosition = getPosition(ref());
    parentPosition = getPosition(ref()?.parentElement);

    props.onPress?.(event);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!dragging()) {
      setDragging(true);
      return props.onDragStart?.(event);
    }
    const delta = {
      x: event.x - pointerDown.x,
      y: event.y - pointerDown.y,
    };
    return props.onDrag?.(event, {
      x: nodeStartPosition.x - parentPosition.x + delta.x,
      y: nodeStartPosition.y - parentPosition.y + delta.y,
    });
  }

  function handlePointerUp(event: PointerEvent) {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    setDragging((isDragging) => {
      if (!isDragging) return isDragging;
      props.onDragEnd?.(event);
      return false;
    });

    props.onRelease?.(event);
  }

  return (
    <div
      ref={setRef}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        transform: `translate(${props.position?.x}px, ${props.position?.y}px)`,
        "pointer-events": dragging() ? "none" : "inherit",
      }}
    >
      {props.children}
    </div>
  );
}

export default CanvasNode;
