/* --- Utils --- */
import { createSignal, PropsWithChildren, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

function CanvasNode<T>(
  props: PropsWithChildren<{ node: T; position?: { x: number; y: number } }>
) {
  const [_, { setFocus }] = useContext(CanvasContext);
  const [ref, setRef] = createSignal<HTMLDivElement | undefined>(undefined);

  function handleMouseOver(e: MouseEvent) {
    e.stopPropagation();
    const el = ref();
    if (el) setFocus([props.node, el]);
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
