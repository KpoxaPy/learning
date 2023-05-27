import { useState, useRef, useEffect } from "react";
import "./Game.css";
import GameOfLife from "./game_of_life";
import useRefState from "../utils/useRefState";
import Canvas, { resizeCanvas } from "../canvas/Canvas";

const CELL_SIZE = 20;

const GameOnCanvas = ({
  width: widthParam,
  height: heightParam,
  cellSize = CELL_SIZE,
}) => {
  const rows = 100;
  const cols = 100;

  const [intervalRef, setInterval] = useRefState(100);
  const [isRunningRef, setRunning] = useRefState(false);
  const [randomLevel, setRandomLevel] = useState(0.3);
  const [canvasAddClass, setCanvasAddClass] = useState("board_editable");

  const s = useRef({}).current;

  const gameState = useRef(new GameOfLife(rows, cols));
  const canvas = useRef(null);
  const image = useRef(null);
  const totalTime = useRef(0);
  const gameIteration = useRef(0);
  const isMouseDown = useRef(false);
  const mouseX = useRef(null);
  const mouseY = useRef(null);
  const viewPortCenterX = useRef(0);
  const viewPortCenterY = useRef(0);
  const viewPortZoomLevel = useRef(1);
  const infoZoomLevel = useRef(null);
  const infoVPCenter = useRef(null);

  const pixelToCell = (x, y) => {
    const ratio = 1 / (cellSize * viewPortZoomLevel.current);
    const gameX =
      Math.floor((x - s.width / 2) * ratio + viewPortCenterX.current) % cols;

    const gameY =
      Math.floor((y - s.height / 2) * ratio + viewPortCenterY.current) % rows;

    return [(gameX + cols) % cols, (gameY + rows) % rows];
  };

  // cx and cy in screen coordinates
  const changeZoom = (newZoomLevel, cx = null, cy = null) => {
    const prevZoomLevel = viewPortZoomLevel.current;
    if (Math.abs(newZoomLevel - prevZoomLevel) > 0.001) {
      if (cx !== null && cy !== null) {
        const shiftRatio = (1 / prevZoomLevel - 1 / newZoomLevel) / cellSize;

        let gameX = viewPortCenterX.current + (cx - s.width / 2) * shiftRatio % cols;
        if (gameX < 0) gameX += cols;
        viewPortCenterX.current = gameX;

        let gameY = viewPortCenterY.current + (cy - s.height / 2) * shiftRatio % rows;
        if (gameY < 0) gameY += rows;
        viewPortCenterY.current = gameY;
      }

      viewPortZoomLevel.current = newZoomLevel;

      if (!isRunningRef.current) {
        drawPixels(canvas.current.savedContext);
      }

      updateInfo();
    }
  };

  // dx and dy in screen coordinates
  const moveViewPort = (dx = null, dy = null) => {
    const ratio = 1 / (cellSize * viewPortZoomLevel.current);

    if (dx === null || dy === null) {
      viewPortCenterX.current = cols / 2;
      viewPortCenterY.current = rows / 2;
    } else {
      let gameX = (viewPortCenterX.current + dx * ratio) % cols;
      if (gameX < 0) gameX += cols;
      viewPortCenterX.current = gameX;

      let gameY = (viewPortCenterY.current + dy * ratio) % rows;
      if (gameY < 0) gameY += rows;
      viewPortCenterY.current = gameY;
    }

    if (!isRunningRef.current) {
      drawPixels(canvas.current.savedContext);
    }

    updateInfo();
  };

  const drawPixels = (ctx) => {
    const pixels = image.current.data;
    for (let x = 0; x < s.width; ++x) {
      for (let y = 0; y < s.height; ++y) {
        const offset = (y * s.width + x) * 4;
        const state = gameState.current.get(...pixelToCell(x, y));
        if (state === 2) {
          pixels[offset] = 200;
          pixels[offset + 1] = 200;
          pixels[offset + 2] = 200;
        } else if (state === 1) {
          pixels[offset] = 50;
          pixels[offset + 1] = 50;
          pixels[offset + 2] = 50;
        }
        pixels[offset + 3] = 255;
      }
    }
    ctx.putImageData(image.current, 0, 0);
  };

  const runGame = () => {
    setRunning(true);
  };

  const stopGame = () => {
    setRunning(false);
  };

  const changeIterationTime = (event) => {
    let value = parseFloat(event.target.value);
    if (!value) {
      value = 0;
    }
    intervalRef.current = value;
    setInterval(value);
    totalTime.current = 0;
    gameIteration.current = 0;
  };

  const runInterations = (elapsedTime) => {
    if (isRunningRef.current) {
      const prevTotalTime = totalTime.current;
      totalTime.current += elapsedTime;
      let interval = intervalRef.current;
      if (interval === 0) {
        interval = 10;
      }

      let newIterationsCount =
        Math.floor(totalTime.current / interval) -
        Math.floor(prevTotalTime / interval);

      if (newIterationsCount > 100) {
        newIterationsCount = 100;
      }

      for (let i = 0; i < newIterationsCount; ++i) {
        ++gameIteration.current;
        gameState.current.runIteration();
      }

      if (newIterationsCount > 0) {
        return true;
      }
    }
    return false;
  };

  const drawBoard = (ctx, { elapsedTime }) => {
    if (runInterations(elapsedTime)) {
      drawPixels(ctx);
    }
  };

  const canvasMouseDown = (e) => {
    if (e.button !== 0) return;
    let x = e.pageX - e.target.offsetLeft;
    let y = e.pageY - e.target.offsetTop;

    isMouseDown.current = true;
    mouseX.current = x;
    mouseY.current = y;
  };

  const canvasMouseUp = (e) => {
    if (e.button !== 0) return;
    let x = e.pageX - e.target.offsetLeft;
    let y = e.pageY - e.target.offsetTop;
    let dX = Math.abs(x - mouseX.current);
    let dY = Math.abs(y - mouseY.current);
    if (dX < 10 && dY < 10) {
      gameState.current.swapCell(...pixelToCell(x, y));
      drawPixels(canvas.current.savedContext);
    }

    setCanvasAddClass("board_editable");
    isMouseDown.current = false;
  };

  const canvasMouseMove = (e) => {
    if (!isMouseDown.current) {
      return;
    }

    if (canvasAddClass !== "board_moving") {
      setCanvasAddClass("board_moving");
    }

    moveViewPort(-e.movementX, -e.movementY);
  };

  const canvasWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.952 : 1.05;
    const cx = e.pageX - e.target.offsetLeft;
    const cy = e.pageY - e.target.offsetTop;
    let newZoomLevel = viewPortZoomLevel.current * delta;
    if (newZoomLevel >= 32) {
      newZoomLevel = 32;
    } else if (newZoomLevel <= 0.05) {
      newZoomLevel = 0.05;
    } else if (Math.abs(newZoomLevel - 1) < 0.025) {
      newZoomLevel = 1;
    }
    changeZoom(newZoomLevel, cx, cy);
  };

  const randomBoard = () => {
    gameState.current.random(randomLevel);
    drawPixels(canvas.current.savedContext);
  };

  const clearBoard = () => {
    gameState.current.clear();
    drawPixels(canvas.current.savedContext);
  };

  const resetCenter = () => {
    moveViewPort();
  };

  const resetZoom = () => {
    changeZoom(1);
  };

  const updateInfo = () => {
    infoZoomLevel.current.innerText = viewPortZoomLevel.current.toFixed(2);
    infoVPCenter.current.innerText = `(${viewPortCenterX.current.toFixed(
      2
    )}; ${viewPortCenterY.current.toFixed(2)})`;
  }

  useEffect(() => {
    const currentCanvas = canvas.current;
    s.width = currentCanvas.width;
    s.height = currentCanvas.height;
    image.current = new ImageData(s.width, s.height);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvas.current) {
          resizeCanvas(canvas.current);
          drawPixels(canvas.current.savedContext);
        }
      }
    });
    resizeObserver.observe(currentCanvas);

    const params = ["wheel", canvasWheel, { passive: false }];
    currentCanvas.addEventListener(...params);

    resizeCanvas(currentCanvas);
    drawPixels(currentCanvas.savedContext);
    updateInfo();

    return () => {
      resizeObserver.disconnect();
      currentCanvas.removeEventListener(...params);
    };
  });

  return (
    <div>
      <Canvas
        className={["board", canvasAddClass].join(" ")}
        {...(widthParam ? `width=${widthParam}` : "")}
        {...(heightParam ? `height=${heightParam}` : "")}
        draw={drawBoard}
        ref={canvas}
        onMouseDown={canvasMouseDown}
        onMouseUp={canvasMouseUp}
        onMouseMove={canvasMouseMove}
      />
      <div className="controls_game">
        {isRunningRef.current ? (
          <button className="controls_game__button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="controls_game__button" onClick={runGame}>
            Run
          </button>
        )}
      </div>
      <div className="controls_inputs">
        <div className="controls_inputs__label">Update every</div>
        <input
          className="controls_inputs__input"
          value={intervalRef.current}
          onChange={changeIterationTime}
        />
        <div className="controls_inputs__unit">msec</div>
      </div>
      <div className="controls_inputs">
        <div className="controls_inputs__label">Random level</div>
        <input
          className="controls_inputs__input"
          value={randomLevel}
          onChange={(e) => setRandomLevel(e.target.value)}
        />
      </div>
      <div className="controls_buttons">
        <button className="button" onClick={randomBoard}>
          Random
        </button>{" "}
        <button className="button" onClick={clearBoard}>
          Clear board
        </button>{" "}
        <button className="button" onClick={resetZoom}>
          Reset zoom
        </button>{" "}
        <button className="button" onClick={resetCenter}>
          Reset center
        </button>
      </div>
      <div className="info">
        <div className="info__label">Zoom level:</div>
        <div className="info__value" ref={infoZoomLevel}></div>
        <div className="info__label">Viewport center:</div>
        <div className="info__value" ref={infoVPCenter}></div>
      </div>
    </div>
  );
};

export default GameOnCanvas;
