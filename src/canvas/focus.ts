import { Accessor, createSignal } from "solid-js";

export type Focus<T> = Readonly<
  [Accessor<[T, HTMLDivElement] | null>, { focus: (item: [T, HTMLDivElement] | null) => void }]
>;

export function createFocus<F>(initialFocus: [F, HTMLDivElement] | null) {
  const [focused, setFocused] = createSignal(initialFocus);

  function focus(item: [F, HTMLDivElement] | null) {
    setFocused(item);
  }

  return [focused, { focus }] as const;
}
