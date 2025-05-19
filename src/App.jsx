import { useState } from "react";
import GameScreen from "./Game";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-orange-300 ">
      {!started ? (
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-orange-800 drop-shadow-lg">
            Tembo's Grote Circusavontuur 🎪🐘
          </h1>
          <p className="text-xl text-orange-700">Word een Circus Assistent en help Tembo!</p>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 px-8 py-4 bg-orange-500 text-white rounded-2xl shadow-lg text-2xl hover:bg-orange-600 transition"
          >
            Start Avontuur
          </button>
        </div>
      ) : (
        <GameScreen />
      )}
    </div>
  );
}

export default App;