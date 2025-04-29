import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../../types/Task';
import { format } from 'date-fns';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  initialData?: Task;
  error?: string | null;
}

/**
 * Component for creating and editing tasks
 */
const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  error
}) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    dueDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    title: '',
    dueDate: ''
  });

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        dueDate: format(new Date(initialData.dueDate), 'yyyy-MM-dd\'T\'HH:mm')
      });
    }
  }, [initialData]);

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));

    // Clear validation errors when field is updated
    if (errors[name as keyof typeof errors]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { title: '', dueDate: '' };

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
      valid = false;
    }

    // Due date validation
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
      valid = false;
    } else {
      const dueDate = new Date(formData.dueDate);
      if (isNaN(dueDate.getTime())) {
        newErrors.dueDate = 'Please enter a valid date';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Parse the date to ensure it's in the correct format
        const dueDateObj = new Date(formData.dueDate);

        // Format the date in the exact format expected by the backend: yyyy-MM-dd'T'HH:mm
        // This format matches what's defined in TaskRequest.java with @JsonFormat
        const formattedDate = format(dueDateObj, "yyyy-MM-dd'T'HH:mm");

        // Make a copy of the form data to avoid modifying the original state
        const formattedData = {
          title: formData.title.trim(),
          description: formData.description ? formData.description.trim() : "",
          status: formData.status,
          dueDate: formattedDate // Properly formatted date
        };

        console.log('Submitting task with data:', formattedData);
        console.log('Due date format being sent:', formattedData.dueDate);

        // Submit the formatted data
        onSubmit(formattedData);
      } catch (error) {
        console.error('Error formatting date:', error);
        setErrors((prev: any) => ({
          ...prev,
          dueDate: 'Invalid date format. Please try again.'
        }));
      }
    }
  };

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__header">
          <h2>{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="task-form__error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="task-form__group">
            <label htmlFor="title" className="task-form__label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="task-form__input"
              maxLength={100}
            />
            {errors.title && <div className="task-form__error">{errors.title}</div>}
          </div>

          <div className="task-form__group">
            <label htmlFor="description" className="task-form__label">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="task-form__textarea"
              maxLength={500}
            />
          </div>

          <div className="task-form__group">
            <label htmlFor="status" className="task-form__label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="task-form__select"
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          <div className="task-form__group">
            <label htmlFor="dueDate" className="task-form__label">Due Date</label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="task-form__input"
            />
            {errors.dueDate && <div className="task-form__error">{errors.dueDate}</div>}
          </div>

          <div className="task-form__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary btn--lg">
              {initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
