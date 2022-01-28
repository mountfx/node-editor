import { createSignal, PropsWithChildren, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

function CanvasNode<T = any>(
  props: PropsWithChildren<{ node: T; position: { x: number; y: number } }>
) {
  const [{ state, selection }, { setFocus }] = useContext(CanvasContext);

  const [ref, setRef] = createSignal<HTMLDivElement>();

  function handlePointerOver(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    const el = ref();
    if (!el) return;
    setFocus([props.node, el]);
  }

  return (
    <div
      ref={setRef}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerEnter={handlePointerOver}
      style={{
        position: "absolute",
        transform: `translate(${props.position?.x}px, ${props.position?.y}px)`,
        "pointer-events":
          state() !== "IDLE" && selection().has(props.node) && focus()?.[0] === props.node
            ? "none"
            : "inherit",
      }}
    >
      {props.children}
    </div>
  );
}

export default CanvasNode;
