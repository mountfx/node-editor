import { Accessor, createSignal } from "solid-js";
import { SignalSetter } from "../utils/utils.types";

export type Camera = [
  {
    readonly position: Accessor<{ x: number; y: number }>;
    readonly scale: Accessor<number>;
  },
  {
    readonly transform: (position: SignalSetter<{ x: number; y: number }>) => void;
    readonly zoom: (delta: SignalSetter<number>) => void;
  }
];

export function createCamera(
  initialPosition = { x: 0, y: 0 },
  initialZoom = 1
): Camera {
  const [position, setPosition] = createSignal(initialPosition);
  const [scale, setScale] = createSignal(initialZoom);

  function transform(position: SignalSetter<{ x: number; y: number }>) {
    setPosition(position);
  }

  function zoom(delta: SignalSetter<number>) {
    setScale(delta);
  }

  return [
    { position, scale },
    { transform, zoom },
  ];
}