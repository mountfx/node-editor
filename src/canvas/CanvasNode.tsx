import { Component } from "solid-js";
import { Node as NodeType } from "../nodes/nodes.types";
import { Focus } from "./createFocus";

const Node: Component<{ node: NodeType, focus: Focus<NodeType> }> = props => {
  const [_, { focus }] = props.focus;

  function handleMouseOver(e: MouseEvent) {
    e.stopPropagation();
    focus(props.node);
  };

  return (
    // style={{ display: "contents" }}
    <div onMouseOver={handleMouseOver}>
      {props.children}
    </div>
  );
};

export default Node;