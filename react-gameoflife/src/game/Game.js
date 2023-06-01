import { useState, useRef, useEffect } from "react";
import Canvas, { resizeCanvas } from "../canvas/Canvas";
import useRefState from "../utils/useRefState";

import "./Game.css";
import GameOfLife from "../game_of_life";

const CELL_SIZE = 20;

const GameOnCanvas = ({
  width: widthParam,
  height: heightParam,
  cellSize = CELL_SIZE,
}) => {
  const [intervalRef, setInterval] = useRefState(100);
  const [isRunningRef, setRunning] = useRefState(false);
  const [randomLevel, setRandomLevel] = useState(GameOfLife.DEFAULT_RANDOM_THRESHOLD);
  const [canvasAddClass, setCanvasAddClass] = useState("board_editable");

  const mainStateRef = useRef(undefined);
  if (!mainStateRef.current) {
    mainStateRef.current = {
      width: undefined,
      height: undefined,

      game: new GameOfLife(new GameOfLife.Topology.Toroid2d(128, 128), new GameOfLife.Rules.Classic()),
      image: undefined,
      time: 0,
      redraw: false,

      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },

      mouse: {
        x: undefined,
        y: undefined,
        isDown: false,
      },
    };
  }
  const s = mainStateRef.current;

  const canvas = useRef(null);
  const infoZoomLevel = useRef(null);
  const infoVPCenter = useRef(null);

  const getTransformPixelToCell = () => {
    const ratio = 1 / (cellSize * s.viewport.zoom);
    const shiftX = s.viewport.x - s.width / 2 * ratio;
    const shiftY = s.viewport.y - s.height / 2 * ratio;

    const o = (x, y) => {
      return [x * ratio + shiftX, y * ratio + shiftY];
    };
    o.delta = ratio;

    return o;
  };

  // cx and cy in screen coordinates
  const changeZoom = (newZoomLevel, cx = null, cy = null) => {
    const prevZoomLevel = s.viewport.zoom;
    if (Math.abs(newZoomLevel - prevZoomLevel) > 0.001) {
      if (cx !== null && cy !== null) {
        const shiftRatio = (1 / prevZoomLevel - 1 / newZoomLevel) / cellSize;

        s.viewport.x += (cx - s.width / 2) * shiftRatio;
        s.viewport.y += (cy - s.height / 2) * shiftRatio;
      }

      s.viewport.zoom = newZoomLevel;

      planRedraw();
      updateInfo();
    }
  };

  // dx and dy in screen coordinates
  const moveViewPort = (dx = null, dy = null) => {
    const ratio = 1 / (cellSize * s.viewport.zoom);

    if (dx === null || dy === null) {
      s.viewport.x = 0;
      s.viewport.y = 0;
    } else {
      s.viewport.x += dx * ratio;
      s.viewport.y += dy * ratio;
    }

    planRedraw();
    updateInfo();
  };

  const runGame = () => {
    setRunning(true);
  };

  const stepGame = () => {
    s.game.runIteration();
    planRedraw();
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
    s.time = 0;
  };

  const runInterations = (elapsedTime) => {
    if (isRunningRef.current) {
      const prevTotalTime = s.time;
      s.time += elapsedTime;
      let interval = intervalRef.current;
      if (interval === 0) {
        interval = 10;
      }

      let newIterationsCount =
        Math.floor(s.time / interval) -
        Math.floor(prevTotalTime / interval);

      if (newIterationsCount > 100) {
        newIterationsCount = 100;
      }

      for (let i = 0; i < newIterationsCount; ++i) {
        s.game.runIteration();
      }

      if (newIterationsCount > 0) {
        return true;
      }
    }
    return false;
  };

  const drawPixels = (ctx) => {
    const pixels = s.image.data;
    const transform = getTransformPixelToCell();
    const [gameStartX, gameStartY] = transform(0, 0);
    let gameX = gameStartX;
    let gameY = undefined;
    for (let x = 0; x < s.width; ++x) {
      gameX += transform.delta;
      gameY = gameStartY;
      for (let y = 0; y < s.height; ++y) {
        gameY += transform.delta;
        const offset = (y * s.width + x) * 4;
        const state = s.game.get(gameX, gameY);
        if (state) {
          pixels[offset] = 200;
          pixels[offset + 1] = 200;
          pixels[offset + 2] = 200;
        } else {
          pixels[offset] = 50;
          pixels[offset + 1] = 50;
          pixels[offset + 2] = 50;
        }
        pixels[offset + 3] = 255;
      }
    }
    ctx.putImageData(s.image, 0, 0);
  };

  const planRedraw = () => {
    s.redraw = true;
  }

  const drawBoard = (ctx, { elapsedTime }) => {
    const doRun = runInterations(elapsedTime) || s.redraw;
    s.redraw = false;
    if (doRun) {
      drawPixels(ctx);
    }
  };

  const canvasMouseDown = (e) => {
    if (e.button !== 0) return;
    let x = e.pageX - e.target.offsetLeft;
    let y = e.pageY - e.target.offsetTop;

    s.mouse.isDown = true;
    s.mouse.x = x;
    s.mouse.y = y;
  };

  const canvasMouseUp = (e) => {
    if (e.button !== 0) return;
    let x = e.pageX - e.target.offsetLeft;
    let y = e.pageY - e.target.offsetTop;
    let dX = Math.abs(x - s.mouse.x);
    let dY = Math.abs(y - s.mouse.y);
    if (dX < 10 && dY < 10) {
      s.game.swapCell(...getTransformPixelToCell()(x, y));
      planRedraw();
    }

    setCanvasAddClass("board_editable");
    s.mouse.isDown = false;
  };

  const canvasMouseMove = (e) => {
    if (!s.mouse.isDown) {
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
    let newZoomLevel = s.viewport.zoom * delta;
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
    s.game.random(randomLevel);
    planRedraw();
  };

  const clearBoard = () => {
    s.game.clear();
    planRedraw();
  };

  const resetCenter = () => {
    moveViewPort();
  };

  const resetZoom = () => {
    changeZoom(1);
  };

  const updateInfo = () => {
    infoZoomLevel.current.innerText = s.viewport.zoom.toFixed(2);
    infoVPCenter.current.innerText = `(${s.viewport.x.toFixed(
      2
    )}; ${s.viewport.y.toFixed(2)})`;
  };

  const resize = (params = {}) => {
    const currentCanvas = canvas.current;
    const { immediate = false } = params;
    if (resizeCanvas(currentCanvas)) {
      s.width = currentCanvas.width;
      s.height = currentCanvas.height;
      s.image = new ImageData(s.width, s.height);
      if (immediate) {
        drawPixels(currentCanvas.savedContext);
      } else {
        planRedraw();
      }
    }
  };

  useEffect(() => {
    const currentCanvas = canvas.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === currentCanvas) {
          resize({ immediate: true });
        }
      }
    });
    resizeObserver.observe(currentCanvas);

    const params = ["wheel", canvasWheel, { passive: false }];
    currentCanvas.addEventListener(...params);

    resize();
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
        )}{" "}
        <button className="controls_game__button" onClick={stepGame}>
          Step
        </button>
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
