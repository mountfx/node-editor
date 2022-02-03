import { Component, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

const Origin: Component = (props) => {
  // const [{ origin }] = useContext(CanvasContext);
  return (
    <div
      id="camera"
      style={{
        // transform: `translate(${origin().x}px, ${origin().y}px)`,
      }}
    >
      {props.children}
    </div>
  );
};

export default Origin;
