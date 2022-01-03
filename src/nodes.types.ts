import { Accessor } from "solid-js";

export type Source = {
  readonly id: string;
  readonly output: string;
} | null;

export type Input = { value: any; source: Source };
export type Output = Accessor<any> | null;

export type IO = {
  inputs?: Record<string, Input>;
  outputs?: Record<string, Output>;
} | null;

export type NodeData = {
  readonly id: string;
  readonly kind: string;
} & IO;

export type Node = Readonly<[NodeData, {
  readonly setInputValue: (socket: string, value: any) => void;
  readonly setInputSource: (socket: string, source: Source) => void;
  readonly setOutput: (socket: string, value: Accessor<any>) => Accessor<any>;
  readonly getInput: (socket: string) => any;
  readonly getInputs: () => Record<string, any>;
}]>;

export type NodesData = {
  [key: string]: Node;
};

export type Nodes = Readonly<[NodesData, {
  readonly createNode: (kind: string) => Node;
  readonly removeNode: (id: string) => void;
}]>;
