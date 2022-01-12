export type LtnSchema = Record<string, {
  inputs?: Record<string, { value: any }>;
  outputs?: Record<string, any>;
}>;

export type LtnEditor = Record<string, LtnNode>;

export type LtnNode = {
  id: string;
  kind: string;
  position: { x: number; y: number };
  inputs?: Record<string, { value: any; source?: { id: string; output: string } }>;
  outputs?: Record<string, any>;
};

export type GetNode<S extends Record<string, any>, K extends keyof S = keyof S> = {
  [k in K]: {
    id: string;
    kind: K;
    position: { x: number; y: number };
    inputs: {
      [I in keyof S[K]["inputs"]]: {
        value: S[K]["inputs"][I]["value"];
        source?: { id: string; output: string };
      };
    };
    outputs: S[K]["outputs"];
  }
}[K];