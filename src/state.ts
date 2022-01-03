import { createMousePosition } from "@solid-primitives/mouse";
// import { createSignal } from "solid-js";
// import { Signal } from "solid-js/types/reactive/signal";

/*
type State = "idle" | "dragNode" | "dragInputSocket" | "dragOutputSocket";
type Action  = "DRAG_NODE" | "PLACE_NODE" | "DRAG_INPUT" | "DRAG_OUTPUT" | "CONNECT_IO" | "ABORT_IO";

type Context = {
  focusedNode: Signal<string | null>;
  selectedNodes: Signal<string[]>;
  mouseEvent: Signal<MouseEvent | null | undefined>;
  camera: {
    position: Signal<[number, number]>;
    zoom: Signal<number>;
  };
};

type Transition = {
  target: State;
  action: (context: Context) => void;
};

type StateDefintion = {
  actions: {
    onEnter: () => void;
    onExit: () => void;
  };
  transitions: Partial<Record<Action, Transition>>;
};

type Machine = {
  context: Context;
  initialState: State;
  states: Record<State, StateDefintion>;
};

export function createMachine() {
  const stateMachine = editorStateMachine;
  const [state, setState] = createSignal(stateMachine.initialState);
  const context = stateMachine.context;

  function transition(event: Action) {
    return setState(s => {
      const currentStateDefinition = stateMachine.states[s];
      // const destinationTransition = currentStateDefinition.transitions[event];
      if (!destinationTransition) return s;
      const destinationState = destinationTransition.target;
      const destinationStateDefinition = stateMachine.states[destinationState];
      destinationTransition.action(context);
      currentStateDefinition.actions.onExit();
      destinationStateDefinition.actions.onEnter();
      return destinationState;
    });
  };
  return [[state, context], transition] as const;
};

const editorStateMachine: Machine = {
  context: {
    focusedNode: createSignal(null),
    selectedNodes: createSignal([]),
    mouseEvent: createSignal(undefined),
    camera: {
      position: createSignal([0, 0]),
      zoom: createSignal(1),
    },
  },
  initialState: "idle",
  states: {
    idle: {
      entry: [],
      exit: [],
      on: {
        DRAG: {
          target: "dragNode",
          actions: ["dragNode"],
        },
      },
    },
    dragNode: {
      entry: [],
      exit: [],
      on: {
        PLACE_NODE: {
          target: "idle",
          actions: ["placeNode"],
        },
      },
    },
    dragInputSocket: {
      entry: [],
      exit: [],
      on: {
        CONNECT_IO: {
          target: "idle",
          actions: ["connectIO"],
        },
        ABORT: {
          target: "idle",
          actions: [],
        },
      },
    },
    dragOutputSocket: {
      entry: [],
      exit: [],
      on: {
        CONNECT_IO: {
          target: "idle",
          actions: ["connectIO"],
        },
        ABORT: {
          target: "idle",
          actions: [],
        },
      },
    },
  },
};

// const [[state, context], transition] = createMachine(editorStateMachine);

// const [_] = context.mousePosition;
// const [selection] = context.selectedNodes;

// createMemo(() => console.log("current state:", state()));
// createMemo(() => console.log("current selection:", selection()));

// transition('DRAG_NODE');
// transition('PLACE_NODE');
// transition('DRAG_INPUT');
// transition('CONNECT_IO');
// transition('DRAG_OUTPUT');
// transition('CONNECT_IO');
*/

// export const [mouseEvent, setMouseEvent] = createSignal<MouseEvent | null | undefined>(undefined);