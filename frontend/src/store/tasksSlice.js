import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: []
  },
  reducers: {
    setTasks(state, action) {
      state.items = action.payload;
    },
    addTask(state, action) {
      state.items.push(action.payload);
    },
    updateTask(state, action) {
      const updated = action.payload;
      const idx = state.items.findIndex((t) => t._id === updated._id);
      if (idx !== -1) {
        state.items[idx] = updated;
      }
    },
    removeTask(state, action) {
      const id = action.payload;
      state.items = state.items.filter((t) => t._id !== id);
    }
  }
});

export const { setTasks, addTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
