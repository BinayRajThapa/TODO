import React from 'react';
import { useSelector } from 'react-redux';
import CustomModal from './CustomModal';

const DeleteModal = ({
  show,
  onHide,
  onConfirm,
  taskIndex,
  customText,
  customTitle
}) => {
  const tasks = useSelector(state => state.tasks);
  const task = taskIndex !== undefined ? tasks[taskIndex] : null;

  return (
    <CustomModal show={show} onClose={onHide}>
      <div className="delete-confirm-modal">
        <div className="modal-header">
          <h3 className="modal-title">{customTitle || 'Confirm Deletion'}</h3>
          <button onClick={onHide} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body">
          <p>{customText || 'Are you sure you want to delete this task?'}</p>

          {/* Show task preview if not using custom bulk delete */}
          {task && !customText && (
            <div className="original-text">
              <p className="mb-0">"{task.task}"</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn btn-secondary" onClick={onHide}>
            Cancel
          </button>
          <button className="modal-btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteModal;
