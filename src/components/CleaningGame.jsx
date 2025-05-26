import { Canvas } from "@react-three/fiber";
import TemboModel from "./TemboModel";

function CleaningGame({
  setActiveMode,
  cleaningProgress,
  resetCleaning,
  handleDraw,
  handleTouchDraw,
  canvasRef,
  setIsDrawing,
  screenWidth
}) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <button
        onClick={() => setActiveMode(null)}
        className="absolute top-4 left-4 z-50 bg-gray-700 bg-opacity-70 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg"
        aria-label="Terug"
      >
        <span style={{ fontSize: 24 }}>←</span>
      </button>
      <p className="text-white text-2xl mb-4">Maak Tembo schoon!</p>
      <div className="relative w-64 h-64">
        <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
          <ambientLight />
          <directionalLight position={[2, 2, 5]} />
          <TemboModel screenWidth={screenWidth} position={[0, -0.2, 0]} rotation={[-0.2, 2.7, 0]} scale={10} zIndexRange={[1000, 1000]} />
        </Canvas>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={handleDraw}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={handleTouchDraw}
        />
      </div>
      <p className="text-white mt-4">{cleaningProgress}% schoon</p>
      <button
        onClick={resetCleaning}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded-xl text-lg hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  );
}
export default CleaningGame;