import React from 'react';
import { format } from 'date-fns';
import { Task, TaskStatus } from '../../../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Component for displaying a single task as a card
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  /**
   * Get CSS class for the status badge based on task status
   */
  const getStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'task-card__status--todo';
      case TaskStatus.IN_PROGRESS:
        return 'task-card__status--in-progress';
      case TaskStatus.COMPLETED:
        return 'task-card__status--completed';
      default:
        return '';
    }
  };

  /**
   * Format the status display name from the enum value
   */
  const formatStatus = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  };

  /**
   * Format dates for display
   */
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className={`task-card__status ${getStatusClass(task.status)}`}>
          {formatStatus(task.status)}
        </span>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__meta">
        <span className="task-card__date">Due: {formatDate(task.dueDate)}</span>
        <span className="task-card__date">Created: {formatDate(task.createdAt)}</span>
      </div>

      <div className="task-card__actions">
        <button 
          className="btn btn--secondary" 
          onClick={onEdit}
          aria-label="Edit task"
        >
          Edit
        </button>
        <button 
          className="btn btn--danger" 
          onClick={onDelete}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
