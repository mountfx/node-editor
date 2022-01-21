import { Component, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

const Camera: Component = (props) => {
  const { camera: [camera] } = useContext(CanvasContext);
  return (
    <div
      id="camera"
      style={{
        transform: `translate(${camera().x}px, ${camera().y}px)`,
      }}
    >
      {props.children}
    </div>
  );
};

export default Camera;
