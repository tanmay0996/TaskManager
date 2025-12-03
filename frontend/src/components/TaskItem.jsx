// TaskItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, FileText } from 'lucide-react';

export function TaskItem({ task, onToggle, onDelete }) {
  const isCompleted = task.status === 'completed';

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
        {/* Left Section - Task Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status Indicator */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(task)}
            className="cursor-pointer mt-0.5 flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <Circle className="w-6 h-6 text-purple-300 hover:text-purple-200 transition-colors" />
            )}
          </motion.div>

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            <motion.p
              animate={{
                opacity: isCompleted ? 0.6 : 1,
              }}
              className={`font-medium text-white transition-all ${
                isCompleted ? 'line-through' : ''
              }`}
            >
              {task.title}
            </motion.p>
            {task.description && (
              <div className="flex items-start gap-1 mt-1">
                <FileText className="w-3 h-3 text-purple-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-purple-200 opacity-80">
                  {task.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(task)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
              isCompleted
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isCompleted ? 'Pending' : 'Done'}
          </motion.button>

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task)}
            className="p-2 rounded-lg bg-pink-500/80 hover:bg-pink-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Decorative gradient line on hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 origin-left rounded-full"
        style={{ transformOrigin: 'left' }}
      />
    </motion.li>
  );
}