import React from 'react';
import { useSelector } from 'react-redux';
import CustomModal from './CustomModal';

const DeleteModal = ({ show, onHide, onConfirm, taskIndex }) => {
  const tasks = useSelector(state => state.tasks);
  const task = tasks[taskIndex];

  return (
    <CustomModal show={show} onClose={onHide}>
      <div className="delete-confirm-modal">
        <div className="modal-header">
          <h3 className="modal-title">Confirm Deletion</h3>
          <button onClick={onHide} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this task?</p>
          {task && (
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