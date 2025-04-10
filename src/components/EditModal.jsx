import React from 'react';
import { useSelector } from 'react-redux';
import CustomModal from './CustomModal';

const EditModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  taskIndex,
  editedText,
  setEditedText 
}) => {
  const tasks = useSelector(state => state.tasks);
  const task = tasks[taskIndex];

  return (
    <CustomModal show={show} onClose={onHide}>
      <div className="edit-confirm-modal">
        <div className="modal-header">
          <h3 className="modal-title">Edit Task</h3>
          <button onClick={onHide} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="editedTask" className="form-label">Task Text</label>
            <textarea
              id="editedTask"
              className="form-control"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows="3"
            />
          </div>
          
          {task && (
            <div className="text-diff">
              <div className="original-text">
                <h6>Original:</h6>
                <p>{task.task}</p>
              </div>
              <div className="edited-text">
                <h6>Edited:</h6>
                <p>{editedText}</p>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn btn-secondary" onClick={onHide}>
            Cancel
          </button>
          <button 
            className="modal-btn btn-primary" 
            onClick={onConfirm}
            disabled={!editedText.trim()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default EditModal;