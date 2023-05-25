import { useState, useRef } from "react";
import "./Game.css";
import GameOfLife from "./game_of_life";
import useRefState from "../utils/useRefState";
// import useTimeStatistics from "../utils/time_stat";

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

const Cell = ({x, y, cellSize, isAlive}) => {
  return (
    <div
      className={isAlive ? "cell-live" : "cell-dead"}
      style={{
        left: `${cellSize * x + 1}px`,
        top: `${cellSize * y + 1}px`,
        width: `${cellSize - 1}px`,
        height: `${cellSize - 1}px`,
      }}
    />
  );
};

const Game = ({width = WIDTH, height = HEIGHT, cellSize = CELL_SIZE}) => {
  const rows = height / cellSize;
  const cols = width / cellSize;
  const gameState = useRef(new GameOfLife(rows, cols));
  const boardRef = useRef(null);
  const timeoutHandler = useRef(null);
  const [cellStates, setCellStates] = useState(gameState.current.cellStates);
  const [intervalRef, setInterval] = useRefState(100);
  const [isRunning, setRunning] = useState(false);
  const [randomLevel, setRandomLevel] = useState(0.3);

  const updateCellStates = () => {
    setCellStates(structuredClone(gameState.current.cellStates));
  };

  const getBoardOffset = () => {
    const rect = boardRef.current.getBoundingClientRect();
    const doc = document.documentElement;
    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  };

  const handleClick = (event) => {
    const boardOffset = getBoardOffset();
    const offsetX = event.clientX - boardOffset.x;
    const offsetY = event.clientY - boardOffset.y;
    const x = Math.floor(offsetX / cellSize);
    const y = Math.floor(offsetY / cellSize);
    if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
      gameState.current.cellStates[y][x] = !gameState.current.cellStates[y][x];
    }
    updateCellStates();
  };


  const runIteration = () => {
    gameState.current.runIteration();
    updateCellStates();
    timeoutHandler.current = window.setTimeout(() => {
      runIteration();
    }, intervalRef.current);
  };

  const runGame = () => {
    setRunning(true);
    runIteration();
  };

  const stopGame = () => {
    setRunning(false);
    if (timeoutHandler.current) {
      window.clearTimeout(timeoutHandler.current);
      timeoutHandler.current = null;
    }
  };

  const randomBoard = () => {
    gameState.current.random(randomLevel);
    updateCellStates();
  };

  let cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push(
        <Cell
          x={x}
          y={y}
          cellSize={cellSize}
          isAlive={cellStates[y][x]}
          key={`${x},${y},${cellStates[y][x]}`}
        />
      );
    }
  }
  return (
    <div>
      <div
        className="board"
        style={{
          width: width,
          height: height,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
        onClick={handleClick}
        ref={boardRef}
      >
        {cells}
      </div>
      <div className="controls">
        Update every <input value={intervalRef.current} onChange={e => setInterval(e.target.value)} />{" "}
        msec{" "}
        {isRunning ? (
          <button className="button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={runGame}>
            Run
          </button>
        )}
      </div>
      <div className="controls">
        {" "}
        Random level{" "}
        <input value={randomLevel} onChange={e => setRandomLevel(e.target.value)} />{" "}
        <button className="button" onClick={randomBoard}>
          Random
        </button>
      </div>
    </div>
  );
};

export default Game;
