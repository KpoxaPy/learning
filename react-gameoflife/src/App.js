// import Game from "./game/Game";
import GameOnCanvas from "./game/GameOnCanvas";

function App() {
  return (
    <div className="App">
      <GameOnCanvas width={800} height={600} cellSize={5} />
    </div>
  );
}

export default App;
