import { useRef, useEffect } from "react";

const useCanvas = (draw, forwardedRef, options = { context: null }) => {
  const fallbackRef = useRef(null)
  const canvasRef = forwardedRef || fallbackRef
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || "2d");
    canvas.savedContext = context;
    let frameCount = 0;
    let animationFrameId;
    let startTime;
    const render = (time) => {
      frameCount++;
      let elapsedTime = 0;
      if (startTime) {
        elapsedTime = time - startTime;
      }
      startTime = time;
      draw(context, { frameCount: frameCount, elapsedTime: elapsedTime });
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, canvasRef, options]);
  return canvasRef;
};
export default useCanvas;
