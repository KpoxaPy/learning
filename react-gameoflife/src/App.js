// import Game from "./game/Game";
import GameOnCanvas from "./game/GameOnCanvas";

function App() {
  return (
    <div className="App">
      <GameOnCanvas width={1200} height={600} cellSize={4} />
    </div>
  );
}

export default App;
