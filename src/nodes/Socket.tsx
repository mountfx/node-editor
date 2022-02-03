// https://dragonman225.js.org/curved-arrows.html

// TODO: This propably needs to be part of the canvas rather than the node
// or make focusable more generic, so it can be passed down as a callback

// import { useContext } from "solid-js";
// import { CanvasContext } from "../canvas";

// Overflow on SVG elements to prevent clipping
// Alternatively put edges in a single svg and have that be the size of the canvas
// https://codepen.io/AmeliaBR/pen/wJRbBO

const Socket = () => {
  // const [_, { setState, setDraggable }] = useContext(CanvasContext);

  // function handlePointerDown(event: PointerEvent) {
  //   setState("POINTING_SOCKET");
  //   setDraggable(false);
  // }

  return (
    <div
      // onPointerDown={handlePointerDown}
      style={{
        width: "8px",
        height: "8px",
        position: "relative",
        "background-color": "black",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
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
