import { createSignal, PropsWithChildren, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

// TODO: Events should be handled by the parent component

function CanvasNode<T = any>(
  props: PropsWithChildren<{ node: T; position: { x: number; y: number } }>
) {
  const [{ selection, pressed }, { setFocus }] = useContext(CanvasContext);

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
      onPointerOver={handlePointerOver}
      style={{
        position: "absolute",
        transform: `translate(${props.position?.x}px, ${props.position?.y}px)`,
        "pointer-events":
          pressed() && selection().has(props.node)
            ? "none"
            : "inherit",
      }}
    >
      {props.children}
    </div>
  );
}

export default CanvasNode;
