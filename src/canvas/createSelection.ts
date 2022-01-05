import { Accessor, createSignal } from "solid-js";
import { SignalSetter } from "../utils/utils.types";

export type Selection<T> = [Accessor<T[]>, { select: (items: SignalSetter<T[]>) => void }];

export function createSelection<Item>(initialSelection: Item[] = []): Selection<Item> {
  const [selected, setSelected] = createSignal<Item[]>(initialSelection);

  function select(items: SignalSetter<Item[]>) {
    setSelected(items);
    return selected;
  }

  return [selected, { select }];
}
