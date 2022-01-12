import { Accessor, createSignal } from "solid-js";
import { SignalSetter } from "../utils/utils.types";

export type Focus<T> = [Accessor<T>, { focus: (item: SignalSetter<T>) => void }];

export function createFocus<Item>(initialFocus: Item): Focus<Item> {
  const [focused, setFocused] = createSignal<Item>(initialFocus);

  function focus(item: SignalSetter<Item>) {
    setFocused(item);
  }

  return [focused, { focus }];
}