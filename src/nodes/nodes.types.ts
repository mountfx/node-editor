import { Accessor } from "solid-js";
import { StoreSetter } from "solid-js/store";

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

type Position = {
  x: number;
  y: number;
};

export type NodeData = {
  readonly id: string;
  readonly kind: string;
  readonly position: Position;
  readonly ref: HTMLDivElement | undefined;
} & IO;

export type Node = Readonly<
  [
    NodeData,
    {
      readonly setInputValue: <T>(socket: string, value: T) => T;
      readonly setInputSource: (socket: string, source: Source) => Source;
      readonly setOutput: (
        socket: string,
        value: Accessor<any>
      ) => Accessor<any>;
      readonly getInput: (socket: string) => any;
      readonly getInputs: () => Record<string, any>;
      readonly setPosition: (position: StoreSetter<Position>) => void;
      readonly setRef: (ref: StoreSetter<HTMLDivElement | undefined>) => void;
    }
  ]
>;

export type NodesData = {
  [key: string]: Node;
};

export type Nodes = Readonly<
  [
    NodesData,
    {
      readonly createNode: (kind: string) => Node;
      readonly removeNode: (id: string) => void;
    }
  ]
>;
