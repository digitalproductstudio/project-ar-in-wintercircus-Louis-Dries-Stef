import { motion } from "framer-motion";

function TaskButtons({ tasks, onTaskClick }) {
  return (
    <div id="task-buttons" className="absolute bottom-20 w-full flex flex-wrap items-center justify-center z-10 pointer-events-auto" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
      {tasks.map((task, idx) => (
        <motion.button
          key={task.id}
          onClick={() => onTaskClick(task)}
          className={`w-20 h-20 m-3 flex items-center justify-center rounded-full shadow-md
            ${task.done ? "bg-green-400" : "bg-orange-400"}
          `}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: idx * 0.1,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{ aspectRatio: "1/1", border: "none" }}
        >
          <img
            src={task.image}
            alt={task.name}
            className="w-10 h-10 object-contain"
            style={{ filter: task.done ? "grayscale(1)" : "none" }}
          />
        </motion.button>
      ))}
    </div>
  );
}
export default TaskButtons;