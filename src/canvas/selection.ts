import { Accessor, createSignal } from "solid-js";
import { SignalSetter } from "../utils/types";

export type Selection<T> = [
  Accessor<T[]>,
  { select: (items: SignalSetter<T[]>) => void }
];

export function createSelection<Item>(
  initialSelection: Item[] = []
): Selection<Item> {
  const [selected, setSelected] = createSignal<Item[]>(initialSelection);

  function select(items: SignalSetter<Item[]>) {
    setSelected(items);
    return selected;
  }

  return [selected, { select }];
}

// export function _createSelection<S extends string>(
//   initialSelection: Record<S, HTMLDivElement>
// ) {
//   const [selected, setSelected] = createSignal(initialSelection);

//   function select(items: )
// }
