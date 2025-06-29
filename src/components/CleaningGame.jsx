import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import TemboModel from "./TemboModel";
import cleaningSound from "/sounds/scrubbing.mp3";

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
  const audioRef = useRef(null);
  const lastMoveTime = useRef(0);
  const moveCheckInterval = useRef(null);

  // State for mobile sponge
  const [touchSponge, setTouchSponge] = useState({ visible: false, x: 0, y: 0 });

  // State for Tembo's position
  const [temboPosition, setTemboPosition] = useState([0, 0, 0]);

  // Setup audio on mount
  useEffect(() => {
    const audio = new Audio(cleaningSound);
    audio.loop = true;
    audio.volume = 1;
    audioRef.current = audio;

    // Interval to check if user stopped moving
    moveCheckInterval.current = setInterval(() => {
      const now = Date.now();
      if (now - lastMoveTime.current > 150) {
        stopAudio();
      }
    }, 100);

    return () => {
      clearInterval(moveCheckInterval.current);
      stopAudio(true);
    };
  }, []);

  // Stop sound when cleaning is done
  useEffect(() => {
    if (cleaningProgress >= 100) {
      stopAudio(true);
    }
  }, [cleaningProgress]);

  // Example logic to update Tembo's position dynamically
  useEffect(() => {
    const updatePosition = () => {
      setTemboPosition([Math.random() * 2 - 1, 0, Math.random() * 2 - 1]);
    };

    const interval = setInterval(updatePosition, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio || cleaningProgress >= 100) return;

    lastMoveTime.current = Date.now();

    if (audio.paused) {
      audio.currentTime = 0;
      audio.play().catch(() => { });
    }
  };

  const stopAudio = (force = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused || force) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const enhancedHandleDraw = (e) => {
    playAudio();
    handleDraw(e);
  };

  // Enhanced touch handlers
  const enhancedHandleTouchDraw = (e) => {
    playAudio();
    handleTouchDraw(e);

    // Show sponge at finger position
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      setTouchSponge({
        visible: true,
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  const handleTouchStart = (e) => {
    setIsDrawing(true);
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      setTouchSponge({
        visible: true,
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    stopAudio();
    setTouchSponge((s) => ({ ...s, visible: false }));
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <button
        onClick={() => setActiveMode(null)}
        className="absolute top-4 left-4 z-50 bg-gray-700 bg-opacity-70 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg"
        aria-label="Terug"
      >
        <span style={{ fontSize: 24 }}>←</span>
      </button>
      <p className="text-white text-2xl mb-4">Maak Tembo schoon!</p>
      <div className="relative w-96 h-96">
        <Canvas
          camera={{ position: [1, 2, 4], fov: 50 }}>
          <ambientLight />
          <directionalLight position={[2, 2, 5]} />
          <TemboModel
            screenWidth={screenWidth}
            rotation={[0, Math.PI, 0]}
            position={temboPosition} // Use dynamic position
            scale={0.3}
          >
            {/* Dirt overlay */}
            <meshStandardMaterial
              map={new THREE.TextureLoader().load("./mud.jpg")}
              transparent={true}
              opacity={0.5}
            />
          </TemboModel>
        </Canvas>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => {
            setIsDrawing(false);
            stopAudio();
          }}
          onMouseMove={enhancedHandleDraw}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={enhancedHandleTouchDraw}
          style={{
            cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48'><text y='50%' font-size='24'>🧽</text></svg>") 16 0, auto`,
            borderRadius: "20px",
          }}
        />
        {/* Sponge icon for mobile touch */}
        {touchSponge.visible && (
          <div
            style={{
              position: "fixed",
              left: touchSponge.x - 20,
              top: touchSponge.y - 24,
              pointerEvents: "none",
              zIndex: 100,
              fontSize: 40,
            }}
          >
            🧽
          </div>
        )}
      </div>
      <p className="text-white mt-4">
        {(
          cleaningProgress <= 20
            ? "Starten maar!"
            : cleaningProgress <= 40
            ? "Zorg dat je goed schoonmaakt!"
            : cleaningProgress <= 60
            ? "Goed bezig!"
            : cleaningProgress <= 80
            ? "Geen plekjes overslaan!"
            : cleaningProgress <= 90
            ? "Bijna klaar!"
            : cleaningProgress <= 95
            ? "Nog even doorzetten!"
            : cleaningProgress <= 97
            ? "Bijna helemaal schoon!"
            : "Fantastisch!"
        )}
      </p>
      <button
        onClick={resetCleaning}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded-xl text-lg hover:bg-red-600"
      >
        Begin opnieuw
      </button>
    </div>
  );
}

export default CleaningGame;