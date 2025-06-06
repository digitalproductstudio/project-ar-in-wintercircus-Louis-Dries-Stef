/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, Html } from "@react-three/drei";
import html2canvas from "html2canvas";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useWindowSize } from "@react-hook/window-size";
import TemboModel from "./components/TemboModel";
import WeetjesCircles from "./components/WeetjesCircles";
import TaskButtons from "./components/TaskButtons";
import CleaningGame from "./components/CleaningGame";
import FeedingGame from "./components/FeedingGame";
import BringingGame from "./components/BringingGame";
import CertificateModal from "./components/CertificateModal";
import WeetjeModal from "./components/WeetjeModal";
import CameraVideo from "./components/CameraVideo";
import taskCompleteSound from "/sounds/complete.mp3";

function GameScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Was Tembo", done: false, image: "./sponge.png" },
    { id: 2, name: "Voeder Tembo", done: false, image: "./food.png" },
    {
      id: 3,
      name: "Verzamel voedsel",
      done: false,
      image: "./basket.png",
    },
  ]);
  const [playerName, setPlayerName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);
  const [width, height] = useWindowSize();
  const [activeMode, setActiveMode] = useState(null);
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [feedingGameProgress, setFeedingGameProgress] = useState(0);
  const [bringingGameProgress, setBringingGameProgress] = useState(0);
  const [availableFood, setAvailableFood] = useState([]);
  const [fallingItems, setFallingItems] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const canvasRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const taskCompleteAudioRef = useRef(null);

  const weetjes = [
    "het wintercircus vroeger een grote garage was? Hier stonden toen heel veel auto’s net een museum",
    "Lang geleden, in 1894, werd er in Gent een speciaal gebouw gemaakt waar het altijd circus kon zijn, zelfs in de winter. ",
    "Er honderd jaar geleden al paarden en olifanten door het Wintercircus liepen, toen het gebouw ook echt als een circus werd gebruikt?",
    "je in de buik van tembo kunt klimmen om naar een voorstelling te kijken?",
  ];
  const [activeWeetje, setActiveWeetje] = useState(null);

  const allDone = tasks.every((task) => task.done);

  function handleTaskClick(task) {
    if (task.name === "Was Tembo") {
      setActiveMode("cleaning");
    } else if (task.name === "Voeder Tembo") {
      setActiveMode("feeding");
    } else if (task.name === "Verzamel voedsel") {
      setActiveMode("bringing");
    }
  }

  // Add a useEffect to show the first weetje when the game starts
  useEffect(() => {
    // Show the first weetje after a short delay
    setTimeout(() => {
      setActiveWeetje(0);
    }, 1000);
  }, []); // Empty dependency array means this runs once when component mounts

  function completeTask(taskName) {
    if (taskCompleteAudioRef.current) {
      taskCompleteAudioRef.current.play().catch((e) => {
        console.warn("Geluid kon niet afgespeeld worden:", e);
      });
    }

    // Find the task index and add 1 to skip the first weetje
    const taskIndex = tasks.findIndex((task) => task.name === taskName);
    
    setTasks((prev) =>
      prev.map((task) =>
        task.name === taskName ? { ...task, done: true } : task
      )
    );

    // Show the corresponding weetje (offset by 1 since first weetje is shown at start)
    setActiveWeetje(taskIndex + 1);

    setActiveMode(null);
    setShowSparkles(true);
    setTimeout(() => {
      setShowSparkles(false);
    }, 2000);
  }

  useEffect(() => {
    taskCompleteAudioRef.current = new Audio(taskCompleteSound);
  }, []);

  async function downloadCertificate() {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current);
      const link = document.createElement("a");
      link.download = "Tembo_Certificaat.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  function handleDraw(e) {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.clearRect(x - 15, y - 15, 30, 30);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    let progress = Math.floor((transparentPixels / totalPixels) * 100);
    if (progress >= 98) progress = 100;
    setCleaningProgress(progress);
  }

  function handleTouchDraw(e) {
    e.preventDefault();

    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.clearRect(x - 15, y - 15, 30, 30);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;
    let transparentPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    let progress = Math.floor((transparentPixels / totalPixels) * 100);
    if (progress >= 98) progress = 100;

    setCleaningProgress(progress);
  }

  function resetCleaning() {
    setCleaningProgress(0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "rgba(139,69,19,0.8)";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  function handleFoodDrop(foodId) {
    setAvailableFood((prev) => prev.filter((f) => f.id !== foodId));
    setFeedingGameProgress((prev) => Math.min(100, prev + 20));
  }

  function collectItem(itemId) {
    setFallingItems((prev) => prev.filter((item) => item.id !== itemId));
    setBringingGameProgress((prev) => Math.min(100, prev + 10));
  }

  useEffect(() => {
    const video = document.getElementById("camera");
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { exact: "environment" },
          },
        })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          // Fallback to any available camera if back camera fails
          console.error("Back camera not available, trying fallback:", err);
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              video.srcObject = stream;
              video.play();
            })
            .catch((err) => {
              console.error("Error accessing any camera:", err);
            });
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

  useEffect(() => {
    if (cleaningProgress >= 100) {
      completeTask("Was Tembo");
    }
  }, [cleaningProgress]);

  useEffect(() => {
    if (activeMode !== "feeding") return;

    const interval = setInterval(() => {
      const foodTypes = ["🍌", "🍎", "🥥", "🥕", "💧"];
      const randomFood =
        foodTypes[Math.floor(Math.random() * foodTypes.length)];

      setAvailableFood((prev) => [
        ...prev,
        {
          id: Math.random(),
          emoji: randomFood,
          x: Math.random() * (window.innerWidth - 50),
          y: 0,
        },
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeMode]);

  useEffect(() => {
    if (feedingGameProgress >= 100) {
      completeTask("Voeder Tembo");
    }
  }, [feedingGameProgress]);

  useEffect(() => {
    if (activeMode !== "bringing") return;

    const interval = setInterval(() => {
      const items = ["🌾", "💧"];
      const randomItem = items[Math.floor(Math.random() * items.length)];

      setFallingItems((prev) => [
        ...prev,
        {
          id: Math.random(),
          emoji: randomItem,
          x: Math.random() * (window.innerWidth - 50),
          y: 0,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMode]);

  useEffect(() => {
    if (activeMode !== "bringing") return;

    const moveInterval = setInterval(() => {
      setFallingItems((prev) =>
        prev.map((item) => ({ ...item, y: item.y + 5 }))
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [activeMode]);

  useEffect(() => {
    if (bringingGameProgress >= 100) {
      completeTask("Verzamel voedsel");
    }
  }, [bringingGameProgress]);

  useEffect(() => {
    if (allDone) {
      setShowCertificate(true);
    }
  }, [allDone]);

  function resetGame() {
    setTasks([
      { id: 1, name: "Was Tembo", done: false, image: "./sponge.png" },
      { id: 2, name: "Voeder Tembo", done: false, image: "./food.png" },
      { id: 3, name: "Verzamel voedsel", done: false, image: "./basket.png" },
    ]);
    setPlayerName("");
    setShowCertificate(false);
    setCleaningProgress(0);
    setFeedingGameProgress(0);
    setBringingGameProgress(0);

    // Camera opnieuw starten
    setTimeout(() => {
      const video = document.getElementById("camera");
      if (video && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream;
          })
          .catch((err) => {
            console.error("Error accessing camera: ", err);
          });
      }
    }, 100);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black touch-none">
      {showCertificate && <Confetti width={width} height={height} />}
      <CameraVideo showCertificate={showCertificate} />
      {!showCertificate && !activeMode && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
              <ambientLight />
              <directionalLight position={[2, 2, 5]} />
              <motion.group
                initial={{ y: 0 }}
                animate={{ y: allDone ? [0, 0.2, -0.2, 0.2, 0] : 0 }}
                transition={{ duration: 1 }}
              >
                <TemboModel screenWidth={width} />
                <WeetjesCircles
                  weetjes={weetjes}
                />
                {showSparkles && (
                  <Sparkles count={30} scale={2} size={3} color="white" />
                )}
              </motion.group>
              <OrbitControls
                enableZoom={false} // Keep zoom disabled (or set to true if needed)
                enablePan={false} // Allow panning (but we'll restrict it)
                autoRotate={true}
                autoRotateSpeed={1.5}
                onChange={(e) => {
                  // Zet de camera vast als je van as beweegt
                  e.target.object.position.y = 0; // As aanpassen

                  e.target.object.updateProjectionMatrix();
                }}
              />
            </Canvas>
          </div>
          <TaskButtons tasks={tasks} onTaskClick={handleTaskClick} />
          {allDone && (
            <div className="absolute bottom-24 w-full flex flex-col items-center space-y-4">
              <p className="text-lg text-white">
                Vul je naam in voor je certificaat:
              </p>
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
      )}
      {activeMode === "cleaning" && (
        <CleaningGame
          setActiveMode={setActiveMode}
          cleaningProgress={cleaningProgress}
          resetCleaning={resetCleaning}
          handleDraw={handleDraw}
          handleTouchDraw={handleTouchDraw}
          canvasRef={canvasRef}   // <-- Corrected!
          setIsDrawing={setIsDrawing}
          screenWidth={width}
        />
      )}
      {activeMode === "feeding" && (
        <FeedingGame
          setActiveMode={setActiveMode}
          availableFood={availableFood}
          feedingGameProgress={feedingGameProgress}
          handleFoodDrop={handleFoodDrop}
          screenWidth={width}
        />
      )}
      {activeMode === "bringing" && (
        <BringingGame
          setActiveMode={setActiveMode}
          fallingItems={fallingItems}
          collectItem={collectItem}
          bringingGameProgress={bringingGameProgress}
        />
      )}
      {showCertificate && (
        <CertificateModal
          certificateRef={certificateRef}
          playerName={playerName}
          setPlayerName={setPlayerName}
          isDownloading={isDownloading}
          downloadCertificate={downloadCertificate}
          resetGame={resetGame}
        />
      )}
      <WeetjeModal
        activeWeetje={activeWeetje}
        weetjes={weetjes}
        onClose={() => setActiveWeetje(null)}
      />
    </div>
  );
}

export default GameScreen;