import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../../types/Task';
import { TaskService } from '../../../services/TaskService';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import DeleteConfirmation from './DeleteConfirmation';

/**
 * Component for displaying and managing the list of tasks
 */
const TaskList: React.FC = () => {
  // State for tasks and loading status
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for task filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter tasks based on the selected status
   */
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'ALL') return true;
    return task.status === filterStatus;
  });

  /**
   * Handle creating a new task
   */
  const handleCreateTask = async (taskData: any) => {
    try {
      await TaskService.createTask(taskData);
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      // You could add error handling UI here
    }
  };

  /**
   * Handle updating an existing task
   */
  const handleUpdateTask = async (taskData: any) => {
    if (!selectedTask) return;

    try {
      await TaskService.updateTask(selectedTask.id, taskData);
      setShowEditModal(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      // You could add error handling UI here
    }
  };

  /**
   * Handle deleting a task
   */
  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await TaskService.deleteTask(selectedTask.id);
      setShowDeleteModal(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      // You could add error handling UI here
    }
  };

  /**
   * Open the edit modal for a task
   */
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  /**
   * Open the delete modal for a task
   */
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  return (
    <div className="task-management">
      <div className="task-management__header">
        <h1>Task Management</h1>
        <button
          className="btn btn--primary btn--icon btn--add"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Task
        </button>
      </div>

      <div className="task-management__filters">
        <button
          className={filterStatus === 'ALL' ? 'active' : ''}
          onClick={() => setFilterStatus('ALL')}
        >
          All
        </button>
        <button
          className={filterStatus === TaskStatus.TODO ? 'active' : ''}
          onClick={() => setFilterStatus(TaskStatus.TODO)}
        >
          To Do
        </button>
        <button
          className={filterStatus === TaskStatus.IN_PROGRESS ? 'active' : ''}
          onClick={() => setFilterStatus(TaskStatus.IN_PROGRESS)}
        >
          In Progress
        </button>
        <button
          className={filterStatus === TaskStatus.COMPLETED ? 'active' : ''}
          onClick={() => setFilterStatus(TaskStatus.COMPLETED)}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="task-management__loading">Loading tasks...</div>
      ) : error ? (
        <div className="task-management__error">{error}</div>
      ) : filteredTasks.length === 0 ? (
        <div className="task-management__empty">
          <h2>No tasks found</h2>
          <p>
            {filterStatus === 'ALL'
              ? 'Get started by adding a new task.'
              : `No ${filterStatus.toLowerCase().replace('_', ' ')} tasks found.`}
          </p>
        </div>
      ) : (
        <div className="task-management__list">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => openEditModal(task)}
              onDelete={() => openDeleteModal(task)}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <TaskForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          title="Create New Task"
        />
      )}

      {showEditModal && selectedTask && (
        <TaskForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          onSubmit={handleUpdateTask}
          title="Edit Task"
          initialData={selectedTask}
        />
      )}

      {showDeleteModal && selectedTask && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTask(null);
          }}
          onConfirm={handleDeleteTask}
          taskTitle={selectedTask.title}
        />
      )}
    </div>
  );
};

export default TaskList;
