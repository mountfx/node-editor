import { createSignal, PropsWithChildren, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

function CanvasNode<T = any>(
  props: PropsWithChildren<{ node: T; position: { x: number; y: number } }>
) {
  const {
    focus: [_, setFocus],
    onNodeMouseOver,
  } = useContext(CanvasContext);

  const [ref, setRef] = createSignal<HTMLDivElement>();

  function handleMouseOver(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const el = ref();
    if (!el) return;
    setFocus([props.node, el]);
    onNodeMouseOver?.(props.node, event);
  }

  return (
    <div
      ref={setRef}
      onMouseOver={handleMouseOver}
      style={{
        position: "absolute",
        transform: `translate(${props.position?.x}px, ${props.position?.y}px)`,
      }}
    >
      {props.children}
    </div>
  );
}

export default CanvasNode;
