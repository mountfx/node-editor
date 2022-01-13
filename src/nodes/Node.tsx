import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { LtnNode } from "./types";

import "./node.css";
import DefaultNode from "./default/DefaultNode";

function Node<N extends LtnNode>(props: {
  node: N;
  components: Record<string, Component<{ node: LtnNode | any }>>;
}) {
  return (
    <div class="node">
      <Dynamic
        component={props.components[props.node.kind] || DefaultNode}
        node={props.node}
      ></Dynamic>
    </div>
  );
}

export default Node;
