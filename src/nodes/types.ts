// TODO: Compute types must depend on inputs and outputs
export type LtnSchema = Record<
  string,
  {
    inputs?: Record<string, { value: any }>;
    outputs?: Record<string, any>;
    compute?: Record<string, (inputs: Record<string, any>) => any>;
    context?: Record<string, any>;
  }
>;

export type LtnNodes = Record<string, LtnNode>;

export type LtnNode = {
  id: string;
  kind: string;
  inputs?: Record<
    string,
    { value: any; source?: { id: string; output: string } }
  >;
  outputs?: Record<string, any>;
  context?: Record<string, any>;
};

export type GetNode<
  S extends Record<string, any>,
  K extends keyof S = keyof S
> = {
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
    // TODO: Add "context"
    context: any;
  };
}[K];
