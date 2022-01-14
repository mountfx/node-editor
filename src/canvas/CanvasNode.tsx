/* --- Utils --- */
import { createSignal, PropsWithChildren } from "solid-js";

/* --- Canvas --- */
import { Focus } from "./focus";

function Node<T>(
  props: PropsWithChildren<{
    id: T;
    focus: Focus<T>;
    position: { x: number; y: number };
  }>
) {
  const [_, { focus }] = props.focus;
  const [ref, setRef] = createSignal<HTMLDivElement | undefined>(undefined);

  function handleMouseOver(e: MouseEvent) {
    e.stopPropagation();
    const el = ref();
    if (el) focus([props.id, el]);
  }
  return (
    <div
      ref={setRef}
      onMouseOver={handleMouseOver}
      style={{
        transform: `translate(${props.position.x}px, ${props.position.y}px)`,
      }}
    >
      {props.children}
    </div>
  );
}

export default Node;
