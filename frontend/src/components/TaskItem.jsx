import React from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between border rounded px-2 py-1 text-sm bg-white">
      <div>
        <p className={task.status === 'completed' ? 'line-through' : ''}>{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-600">{task.description}</p>
        )}
      </div>
      <div className="space-x-2 text-xs">
        <button
          onClick={() => onToggle(task)}
          className="px-2 py-0.5 rounded bg-green-500 text-white"
        >
          {task.status === 'completed' ? 'Pending' : 'Done'}
        </button>
        <button
          onClick={() => onDelete(task)}
          className="px-2 py-0.5 rounded bg-red-500 text-white"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
