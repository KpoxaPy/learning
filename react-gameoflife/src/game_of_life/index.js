import GameOfLife from "./game_of_life";
import { DEFAULT_RANDOM_THRESHOLD } from "./game_of_life";

import { Toroid2d } from "./topology";

import GoL_Rules from "./rules/gol";

GameOfLife.Topology = {
  Toroid2d: Toroid2d,
};

GameOfLife.Rules = {
  Classic: GoL_Rules
};

export default GameOfLife;
export { DEFAULT_RANDOM_THRESHOLD };