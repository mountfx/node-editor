import { Component } from "solid-js";
import { Node } from "./nodes.types";

const Edge: Component<{ node: Node, socket: string }> = props => {
  // const [node, { setInputSource }] = props.node;

  function handleMouseDown(e: MouseEvent) {};
  function handleMouseUp(e: MouseEvent) {};

  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}></div>
  );
};

export default Edge;