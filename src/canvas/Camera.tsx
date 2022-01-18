import { Component, useContext } from "solid-js";
import { CanvasContext } from "./Canvas";

const Camera: Component = (props) => {
  const [
    {
      camera: { position },
    },
  ] = useContext(CanvasContext);
  return (
    <div
      id="camera"
      style={{
        transform: `translate(${position().x}px, ${position().y}px)`,
      }}
    >
      {props.children}
    </div>
  );
};

export default Camera;
