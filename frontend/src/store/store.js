import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice.js';

const store = configureStore({
  reducer: {
    tasks: tasksReducer
  }
});

export default store;
