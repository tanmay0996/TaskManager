import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Tasks from './Tasks.jsx';
import store from '../store/store.js';
import api from '../utils/api.js';

vi.mock('../utils/api.js');

function renderTasks(initialEntries = ['/']) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Tasks />
      </MemoryRouter>
    </Provider>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Tasks page', () => {
  it('renders tasks from API', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        { _id: '1', title: 'Task One', description: 'First', status: 'pending' },
        { _id: '2', title: 'Task Two', description: 'Second', status: 'completed' }
      ]
    });

    renderTasks();

    expect(await screen.findByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  it('clears token and redirects to /login on 401', async () => {
    const removeItemSpy = vi.spyOn(window.localStorage.__proto__, 'removeItem');
    api.get.mockRejectedValueOnce({ response: { status: 401 } });

    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '/', pathname: '/' };

    renderTasks(['/']);

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith('token');
    });

    window.location = originalLocation;
  });

  it('shows validation error when adding task without title', async () => {
    const user = userEvent.setup();

    api.get.mockResolvedValueOnce({ data: [] });
    renderTasks();

    const addButton = await screen.findByRole('button', { name: /add task/i });
    await user.click(addButton);

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });
});
