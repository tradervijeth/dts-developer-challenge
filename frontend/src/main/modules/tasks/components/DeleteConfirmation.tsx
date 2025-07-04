import React from 'react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

/**
 * Component for confirming task deletion
 */
const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle
}) => {
  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__header">
          <h2>Delete Task</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="delete-confirmation">
          <div className="delete-confirmation__icon">🗑️</div>
          <h3 className="delete-confirmation__title">Delete Task</h3>
          <p className="delete-confirmation__message">
            Are you sure you want to delete the task: <strong>{taskTitle}</strong>?<br />
            This action cannot be undone.
          </p>

          <div className="delete-confirmation__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn--danger btn--icon btn--delete" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
