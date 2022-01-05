import { Accessor, createSignal } from "solid-js";
import { SignalSetter } from "../utils/utils.types";

export type Focus<T> = [Accessor<T | null>, { focus: (item: SignalSetter<T | null>) => void }];

export function createFocus<Item>(initialFocus: Item | null = null): Focus<Item> {
  const [focused, setFocused] = createSignal<Item | null>(initialFocus);

  function focus(item: SignalSetter<Item | null>) {
    setFocused(item);
  }

  return [focused, { focus }];
}
