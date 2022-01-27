// https://dragonman225.js.org/curved-arrows.html

// Overflow on SVG elements to prevent clipping
// Alternatively put edges in a single svg and have that be the size of the canvas
// https://codepen.io/AmeliaBR/pen/wJRbBO

import { createSignal, useContext } from "solid-js";

// import { CanvasContext } from "../canvas";

const Socket = () => {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  
  // Get Socket offset like this
  // const [{ focus }] = useContext(CanvasContext);
  // focus()?.[1].getElementsByClassName("outputs").item(0)?.getBoundingClientRect()

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    setX(x => x - e.movementX);
    setY(y => y + e.movementY);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        width: "8px",
        height: "8px",
        position: "relative",
        "background-color": "black",
      }}
    >
      <div
        style={{
          width: x() + "px",
          height: y() + "px",
          position: "absolute",
          right: 0,
          "pointer-events": "none",
          "background-color": "green",
        }}
      ></div>
    </div>
  );
};

export default Socket;
