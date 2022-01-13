import { Accessor, createSignal } from "solid-js";
import { SignalSetter } from "../utils/types";

export type Focus<T> = Readonly<[Accessor<T>, { focus: (item: SignalSetter<T>) => void }]>;

export function createFocus<Item>(initialFocus: Item) {
  const [focused, setFocused] = createSignal(initialFocus);

  function focus(item: SignalSetter<Item>) {
    setFocused(item);
  }

  return [focused, { focus }] as const;
}