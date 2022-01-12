/* --- Utils --- */
import { Component, createEffect } from "solid-js";

// TODO: These methods needs to be passed down via props or by using context.
import { useNode } from "../../App";
import type { GetNode } from "../store.types";

import { defaultSchema } from ".";
import DefaultNode from "./DefaultNode";

const AddNode: Component<{ node: GetNode<typeof defaultSchema, "add"> }> = (
  props
) => {
  const { setOutput, getInput } = useNode(props.node);
  createEffect(() => setOutput("sum", getInput("a") + getInput("b")));
  return <DefaultNode node={props.node} />;
};

export default AddNode;
