import React from "react";
import useCanvas from "./useCanvas";

const Canvas = React.forwardRef((props, ref) => {
  const __draw = () => {};
  const { draw = __draw, options = {}, ...rest } = props;
  const { context = null } = options;
  const canvasRef = useCanvas(draw, ref, { context });

  return <canvas ref={canvasRef} {...rest} />;
});

export default Canvas;
