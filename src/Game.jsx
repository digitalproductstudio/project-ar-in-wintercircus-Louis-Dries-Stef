/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sparkles } from "@react-three/drei";
import { useWindowSize } from "@react-hook/window-size";

function TemboModel() {
  const { scene } = useGLTF("/tembo.glb");
  return (
    <primitive
      object={scene}
      scale={0.004}
      position={[0.5, -1, 0]}
      rotation={[0, 30, 0]}
    />
  );
}

function GameScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Was Tembo", done: false },
    { id: 2, name: "Voer Tembo", done: false },
    { id: 3, name: "Breng hooi en water", done: false },
  ]);
  const [playerName, setPlayerName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);
  const [width, height] = useWindowSize();

  const [activeMode, setActiveMode] = useState(null); // Nieuw: houdt bij welke taak actief is
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [feedingProgress, setFeedingProgress] = useState(0);
  const [bringingProgress, setBringingProgress] = useState(0);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const allDone = tasks.every(task => task.done);

  function handleTaskClick(task) {
    if (task.name === "Was Tembo") {
      setActiveMode("cleaning");
    } else if (task.name === "Voer Tembo") {
      setActiveMode("feeding");
    } else if (task.name === "Breng hooi en water") {
      setActiveMode("bringing");
    }
  }

  async function downloadCertificate() {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current);
      const link = document.createElement("a");
      link.download = "Tembo_Certificaat.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  useEffect(() => {
    const video = document.getElementById("camera");
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    }
  }, []);

  useEffect(() => {
    if (activeMode === "cleaning" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = "rgba(139,69,19,0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [activeMode]);

  function handleDraw(e) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    updateCleaningProgress();
  }

  function updateCleaningProgress() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let dirtyPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 50) dirtyPixels++;
    }
    const totalPixels = (canvas.width * canvas.height);
    const progress = 100 - Math.round((dirtyPixels / totalPixels) * 100);
    setCleaningProgress(progress);
  }

  function resetCleaning() {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(139,69,19,0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setCleaningProgress(0);
    }
  }

  function completeTask(name) {
    setTasks(prev =>
      prev.map(task => task.name === name ? { ...task, done: true } : task)
    );
    setActiveMode(null);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 4000);
  }

  useEffect(() => {
    if (cleaningProgress >= 90) {
      completeTask("Was Tembo");
      setCleaningProgress(0);
    }
  }, [cleaningProgress]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {showCertificate && <Confetti width={width} height={height} />}

      {!showCertificate && !activeMode ? (
        <>
          {/* Webcam Background */}
          <video
            id="camera"
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 3D Tembo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
              <ambientLight />
              <directionalLight position={[2, 2, 5]} />
              <motion.group
                initial={{ y: 0 }}
                animate={{ y: allDone ? [0, 0.2, -0.2, 0.2, 0] : 0 }}
                transition={{ duration: 1 }}
              >
                <TemboModel />
                {showSparkles && (
                  <Sparkles
                    count={30}
                    scale={2}
                    size={3}
                    color="white"
                  />
                )}
              </motion.group>
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>

          {/* Takenlijst */}
          <div className="absolute bottom-1 w-full flex flex-row flex-wrap items-center space-y-2 space-x-2 justify-center z-10 pointer-events-auto">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`px-6 py-3 rounded-2xl text-xl shadow-md ${
                  task.done ? "bg-green-400 text-white" : "bg-orange-400 text-white"
                }`}
              >
                {task.done ? `✅ ${task.name}` : task.name}
              </button>
            ))}
          </div>

          {allDone && (
            <div className="absolute bottom-24 w-full flex flex-col items-center space-y-4">
              <p className="text-lg text-white">Vul je naam in voor je certificaat:</p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="border-2 border-white p-2 rounded-lg text-lg bg-black text-white placeholder-white"
                placeholder="Jouw naam"
              />
              <button
                onClick={() => setShowCertificate(true)}
                disabled={!playerName}
                className="bg-green-500 text-white px-6 py-3 rounded-2xl text-xl hover:bg-green-600"
              >
                Toon certificaat
              </button>
            </div>
          )}
        </>
      ) : activeMode === "cleaning" ? (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <p className="text-white text-2xl mb-4">Maak Tembo schoon!</p>
          <div className="relative w-64 h-64">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
              <ambientLight />
              <directionalLight position={[2, 2, 5]} />
              <TemboModel />
            </Canvas>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseMove={handleDraw}
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
      ) : activeMode === "feeding" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-800 bg-opacity-90 z-50 space-y-6">
          <p className="text-3xl text-white">Voer Tembo!</p>
          <button
            onClick={() => completeTask("Voer Tembo")}
            className="bg-yellow-400 text-black px-8 py-4 rounded-2xl text-xl hover:bg-yellow-500"
          >
            🍌 Geef Banaan
          </button>
        </div>
      ) : activeMode === "bringing" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-800 bg-opacity-90 z-50 space-y-6">
          <p className="text-3xl text-white">Breng hooi en water!</p>
          <button
            onClick={() => completeTask("Breng hooi en water")}
            className="bg-yellow-300 text-black px-8 py-4 rounded-2xl text-xl hover:bg-yellow-400"
          >
            🐘 Breng Hooi
          </button>
        </div>
      ) : (
        <>
          {/* Certificaat */}
          <div ref={certificateRef} className="w-full max-w-md mx-auto mt-20 bg-yellow-100 p-8 rounded-2xl shadow-2xl text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-orange-700">🎖️ Officieel Certificaat 🎖️</h2>
            <p className="text-lg text-orange-600">Dit certificeert dat</p>
            <h3 className="text-4xl font-bold text-green-700">{playerName}</h3>
            <p className="text-lg text-orange-600">met succes Tembo heeft verzorgd!</p>
            <p className="text-sm text-gray-500">Tembo's Grote Circusavontuur - {new Date().toLocaleDateString()}</p>
          </div>
          <button
            onClick={downloadCertificate}
            className="mt-6 bg-orange-500 text-white px-8 py-4 rounded-2xl text-xl hover:bg-orange-600"
          >
            Download Certificaat
          </button>
        </>
      )}
    </div>
  );
}

export default GameScreen;