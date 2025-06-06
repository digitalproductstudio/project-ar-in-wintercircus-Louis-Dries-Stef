/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import itemPickUpSound from "/sounds/item-pick-up.mp3";

function BringingGame({
  setActiveMode,
  fallingItems,
  collectItem,
  bringingGameProgress
}) {
  const pickUpAudioRef = useRef(null);

  useEffect(() => {
    pickUpAudioRef.current = new Audio(itemPickUpSound);
  }, []);

  const handleItemClick = (id) => {
    if (pickUpAudioRef.current) {
      pickUpAudioRef.current.currentTime = 0;
      pickUpAudioRef.current.play().catch((err) =>
        console.warn("Geluid kon niet afgespeeld worden:", err)
      );
    }
    collectItem(id);
  };

  // State for mobile basket/food icon
  const [touchIcon, setTouchIcon] = useState({ visible: false, x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      setTouchIcon({
        visible: true,
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      setTouchIcon({
        visible: true,
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchIcon((s) => ({ ...s, visible: false }));
  };

  return (
    <div className="absolute inset-0 bg-blue-800 bg-opacity-90 flex flex-col items-center justify-center z-50">
      <button
        onClick={() => setActiveMode(null)}
        className="absolute top-4 left-4 z-50 bg-gray-700 bg-opacity-70 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg"
        aria-label="Terug"
      >
        <span style={{ fontSize: 24 }}>←</span>
      </button>
      <p className="text-3xl text-white mb-4">Vang hooi en water!</p>
      <div className="relative w-full h-1/2">
        {fallingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-4xl"
            style={{
              top: item.y,
              left: item.x,
              cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🧺</text></svg>") 16 0, auto`,
            }}
            onClick={() => handleItemClick(item.id)}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>
      <div className="mt-6 w-1/2 bg-white rounded-full overflow-hidden">
        <div
          className="bg-blue-400 h-6"
          style={{ width: `${bringingGameProgress}%` }}
        ></div>
      </div>
      <p className="text-white mt-2">{bringingGameProgress}% verzameld</p>
      {/* Basket or food icon for mobile touch */}
      {touchIcon.visible && (
        <div
          style={{
            position: "fixed",
            left: touchIcon.x - 20,
            top: touchIcon.y - 24,
            pointerEvents: "none",
            zIndex: 100,
            fontSize: 40,
          }}
        >
          🧺 {/* Or use 🥕, 🍎, etc. */}
        </div>
      )}
    </div>
  );
}
export default BringingGame;