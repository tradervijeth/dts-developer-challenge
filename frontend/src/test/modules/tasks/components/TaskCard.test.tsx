import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../../../../main/modules/tasks/components/TaskCard';
import { Task, TaskStatus } from '../../../../main/types/Task';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task',
    status: TaskStatus.TODO,
    dueDate: '2023-12-31T12:00:00',
    createdAt: '2023-01-01T12:00:00',
    updatedAt: '2023-01-01T12:00:00'
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the task card with correct information', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByRole('button', { name: /Edit task/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete task/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('applies the correct CSS class based on task status', () => {
    // Test TODO status
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('To Do')).toHaveClass('task-card__status--todo');

    // Test IN_PROGRESS status
    const inProgressTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
    render(
      <TaskCard 
        task={inProgressTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('In Progress')).toHaveClass('task-card__status--in-progress');

    // Test COMPLETED status
    const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    render(
      <TaskCard 
        task={completedTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Completed')).toHaveClass('task-card__status--completed');
  });
});
