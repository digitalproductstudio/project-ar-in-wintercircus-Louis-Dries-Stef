import { Canvas } from "@react-three/fiber";
import TemboModel from "./TemboModel";
import { motion } from "framer-motion";

function FeedingGame({
  setActiveMode,
  availableFood,
  feedingGameProgress,
  handleFoodDrop,
  screenWidth
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-800 bg-opacity-90 z-50">
      <button
        onClick={() => setActiveMode(null)}
        className="absolute top-4 left-4 z-50 bg-gray-700 bg-opacity-70 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg"
        aria-label="Terug"
      >
        <span style={{ fontSize: 24 }}>←</span>
      </button>
      <p className="text-3xl text-white mb-4">Voeder Tembo!</p>
      <div className="relative w-full h-1/2">
        <div className="relative w-64 h-64 mx-auto">
          <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
            <ambientLight />
            <directionalLight position={[2, 2, 5]} />
            <TemboModel screenWidth={screenWidth} />
          </Canvas>
          <div
            id="tembo-mouth"
            className="absolute top-[90px] bg-black left-1/2 transform -translate-x-1/2 w-16 h-16"
          />
        </div>
        {availableFood.map((food) => (
          <motion.div
            key={food.id}
            drag
            dragElastic={0.5}
            onDragEnd={(e, info) => {
              const mouth = document
                .getElementById("tembo-mouth")
                .getBoundingClientRect();
              if (
                info.point.x > mouth.left &&
                info.point.x < mouth.right &&
                info.point.y > mouth.top &&
                info.point.y < mouth.bottom
              ) {
                handleFoodDrop(food.id);
              }
            }}
            className="absolute text-4xl cursor-pointer z-20"
            style={{ top: food.y, left: food.x }}
          >
            {food.emoji}
          </motion.div>
        ))}
      </div>
      <div className="mt-6 w-1/2 bg-white rounded-full overflow-hidden">
        <div
          className="bg-green-400 h-6"
          style={{ width: `${feedingGameProgress}%` }}
        ></div>
      </div>
      <p className="text-white mt-2">{feedingGameProgress}% gevoerd</p>
    </div>
  );
}
export default FeedingGame;