import { createSignal, onCleanup, useContext } from "solid-js";

import "./debugger.css"

import { CanvasContext } from "..";

// Simple FPS counter
let times: number[] = [];
const [fps, setFps] = createSignal(0);
function fpsLoop() {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    };
    times.push(now);
    setFps(times.length);
    return requestAnimationFrame(fpsLoop);
};

const Debugger = () => {
  window.requestAnimationFrame(fpsLoop);
  onCleanup(() => window.cancelAnimationFrame(fpsLoop()));

  const [{ focus, selection, pressed, dragging }] = useContext(CanvasContext);

  return (
    <dl id="debugger">
      <dd>{pressed() ? "True" : "False"}</dd><dt>Pressed</dt>
      <dd>{dragging() ? "True" : "False"}</dd><dt>Dragging</dt>
      <dd>{focus()?.[0].id}</dd><dt>Focused Entity</dt>
      <dd>{fps()}</dd><dt>FPS</dt>
  </dl>
  )
}

export default Debugger;