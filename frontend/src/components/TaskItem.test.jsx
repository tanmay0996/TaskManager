import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem.jsx';

const sampleTaskPending = {
  _id: '1',
  title: 'Sample Task',
  description: 'Sample description',
  status: 'pending',
};

const sampleTaskCompleted = {
  ...sampleTaskPending,
  status: 'completed',
};

describe('TaskItem', () => {
  it('renders title and description', () => {
    render(
      <TaskItem
        task={sampleTaskPending}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Sample Task')).toBeInTheDocument();
    expect(screen.getByText('Sample description')).toBeInTheDocument();
  });

  it('shows "Done" for pending tasks and "Pending" for completed tasks', () => {
    const { rerender } = render(
      <TaskItem
        task={sampleTaskPending}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();

    rerender(
      <TaskItem
        task={sampleTaskCompleted}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /pending/i })).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <TaskItem
        task={sampleTaskPending}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />
    );

    // specifically target the toggle button ("Done"), not any button
    const toggleButton = screen.getByRole('button', { name: /done/i });

    await user.click(toggleButton);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(sampleTaskPending);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={sampleTaskPending}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete task/i });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(sampleTaskPending);
  });
});
