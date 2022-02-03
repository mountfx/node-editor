import { createSignal, useContext, type PropsWithChildren } from "solid-js";
import { CanvasContext } from "./Canvas";

type Props = {
  node: any;
  initialPosition?: { x: number; y: number };

  onNodePress?: (node: any, position: { x: number; y: number }) => void;
};

function CanvasNode<T = any>(
  props: PropsWithChildren<{
    node: T;
    position: { x: number; y: number };
  }>
) {
  const [_, { setFocus }] = useContext(CanvasContext);

  const [ref, setRef] = createSignal<HTMLDivElement>();

  // function handlePointerOver(event: PointerEvent) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const el = ref();
  //   if (!el) return;
  // }

  return (
    <div
      ref={setRef}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerEnter={() => setFocus([props.node, ref()])}
      style={{
        position: "absolute",
        transform: `translate(${props.position?.x}px, ${props.position?.y}px)`,
        // "pointer-events":
        //   state() !== "IDLE" && selection().has(props.node)
        //     ? "none"
        //     : "inherit",
      }}
    >
      {props.children}
    </div>
  );
}

export default CanvasNode;
