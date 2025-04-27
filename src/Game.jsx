/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useWindowSize } from "@react-hook/window-size";

function TemboModel() {
  const { scene } = useGLTF("/tembo.glb");

  return (
    <primitive
      object={scene}
      scale={0.004}      // kleiner maken
      position={[0, -1, 0]}  // iets omlaag zetten
      rotation={[0, Math.PI, 0]} // 180 graden draaien (kijkt naar camera)
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

  const allDone = tasks.every(task => task.done);

  function handleTaskComplete(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: true } : task
      )
    );
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {showCertificate && <Confetti width={width} height={height} />}

      {!showCertificate ? (
        <>
          {/* Webcam Background */}
          <video
            id="camera"
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 3D Tembo over de camera */}
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
              </motion.group>
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>

          {/* Takenlijst */}
          <div className="absolute bottom-10 w-full flex flex-col items-center space-y-4">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => handleTaskComplete(task.id)}
                className={`px-6 py-3 rounded-2xl text-xl shadow-md ${
                  task.done ? "bg-green-400 text-white" : "bg-orange-400 text-white"
                }`}
              >
                {task.done ? `✅ ${task.name}` : task.name}
              </button>
            ))}

            {/* Naam en certificaat */}
            {allDone && (
              <div className="mt-8 text-center space-y-4">
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
                  className="block mx-auto mt-4 bg-green-500 text-white px-6 py-3 rounded-2xl text-xl hover:bg-green-600"
                >
                  Toon certificaat
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Certificaat Weergave */}
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