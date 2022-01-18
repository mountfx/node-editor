import { Dynamic } from "solid-js/web";
import { LtnNode, LtnSchema } from "./types";

import "./node.css";
import DefaultNode from "./defaults/DefaultNode";

function Node<N extends LtnNode>(props: {
  node: N;
  schema: LtnSchema;
}) {
  return (
    <div class="node">
      <Dynamic
        component={props.schema[props.node.kind]?.component || DefaultNode}
        node={props.node}
      ></Dynamic>
    </div>
  );
}

export default Node;
