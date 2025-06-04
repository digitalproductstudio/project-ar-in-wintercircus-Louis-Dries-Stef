/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

function BringingGame({
  setActiveMode,
  fallingItems,
  collectItem,
  bringingGameProgress
}) {
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
            onClick={() => collectItem(item.id)}
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
    </div>
  );
}
export default BringingGame;