import { useState } from "react";

const MAX_VALUES_IN_MEMORY = 100;

const useTimeStatistics = (max = MAX_VALUES_IN_MEMORY) => {
  let lastTime = undefined;
  let values = [];
  let [, setStats] = useState(null);

  const collectStats = () => {
    if (this.values.length > 0) {
      const sum = this.values.reduce((a, c) => a + c, 0);
      const avg = sum / this.values.length;
      setStats({
        avg: avg,
      });
    }
  };

  const reset = () => {
    values = [];
  };

  const start = () => {
    lastTime = performance.now();
  };

  const commit = (time) => {
    let commitTime;
    if (time) {
        commitTime = time;
    } else if (lastTime) {
        commitTime = performance.now() - lastTime;
    } else {
        throw Error("You need either specify time to commit or invoke start() to start timing");
    }

    values.push(commitTime);
    if (values.length > max) values.shift();
    collectStats();
  };

  return {
    reset: reset,
    start: start,
    commit: commit,
    collectStats: collectStats,
  };
};

export default useTimeStatistics;
