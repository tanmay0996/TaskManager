import { describe, it, expect } from 'vitest';
import tasksReducer, { setTasks, addTask, updateTask, removeTask } from './tasksSlice.js';

describe('tasksSlice reducers', () => {
  it('setTasks replaces items', () => {
    const initialState = { items: [] };
    const next = tasksReducer(initialState, setTasks([{ _id: '1', title: 'A' }]));
    expect(next.items).toHaveLength(1);
    expect(next.items[0].title).toBe('A');
  });

  it('addTask appends item', () => {
    const initialState = { items: [] };
    const next = tasksReducer(initialState, addTask({ _id: '1', title: 'Task' }));
    expect(next.items).toHaveLength(1);
    expect(next.items[0]._id).toBe('1');
  });

  it('updateTask updates matching item', () => {
    const initialState = { items: [{ _id: '1', title: 'Old' }] };
    const next = tasksReducer(initialState, updateTask({ _id: '1', title: 'New' }));
    expect(next.items[0].title).toBe('New');
  });

  it('removeTask removes by id', () => {
    const initialState = { items: [{ _id: '1' }, { _id: '2' }] };
    const next = tasksReducer(initialState, removeTask('1'));
    expect(next.items).toHaveLength(1);
    expect(next.items[0]._id).toBe('2');
  });
});
