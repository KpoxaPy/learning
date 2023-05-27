import React from "react";
import useCanvas from "./useCanvas";

function resizeCanvas(canvas) {
  const { width, height } = canvas.getBoundingClientRect()

  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window
    const context = canvas.getContext('2d')
    canvas.width = width * ratio
    canvas.height = height * ratio
    context.scale(ratio, ratio)
    return true
  }

  return false
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