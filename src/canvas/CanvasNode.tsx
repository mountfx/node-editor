/* --- Utils --- */
import { PropsWithChildren } from "solid-js";
import { SignalSetter } from "../utils/utils.types";

/* --- Canvas --- */
import { Focus } from "./createFocus";

function Node<T>(
  props: PropsWithChildren<{
    id: SignalSetter<T>;
    focus: Focus<T>;
    position: { x: number; y: number };
  }>
) {
  const [_, { focus }] = props.focus;

  function handleMouseOver(e: MouseEvent) {
    e.stopPropagation();
    focus(props.id);
  }
  return (
    <div
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
