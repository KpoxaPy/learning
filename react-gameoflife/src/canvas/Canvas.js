import React from "react";
import useCanvas from "./useCanvas";

function resizeCanvas(canvas, size) {
  let width, height;
  if (size) {
    ({ width, height } = size);
  } else {
    ({ width, height } = canvas.getBoundingClientRect());
  }

  width = Math.floor(width);
  height = Math.floor(height);
  
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}

const Canvas = React.forwardRef((props, ref) => {
  const __draw = () => { };
  const { draw = __draw, options = {}, ...rest } = props;
  const { context = null } = options;
  const canvasRef = useCanvas(draw, ref, { context });

  return <canvas ref={canvasRef} {...rest} />;
});

export default Canvas;
export { resizeCanvas };