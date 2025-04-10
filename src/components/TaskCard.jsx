import React from "react";
import { TAG_COLORS } from '../utils/constants';
import "./TaskCard.css";

const getTagColor = (tag) => TAG_COLORS[tag] || '#6457f9';
const TaskCard = ({ 
  title,
  tags,
  id,
  setActiveCard, 
  onDelete, 
  onEdit, 
  isSelected,
  onToggleSelect
}) => {

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", id);
    setActiveCard(id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
    setActiveCard(null);
  };

  return (
    <article 
    className={`task_card ${isSelected ? 'selected' : ''}`} 
    draggable
    onDragStart={handleDragStart}
    onDragEnd={(e) => {
      e.currentTarget.classList.remove("dragging");
      setActiveCard(null);
    }}
  >

      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(id)}
        onClick={(e) => e.stopPropagation()}
        className="task-checkbox"
      />

      <p className='task_text'>{title}</p>

      <div className='task_card_bottom_line'>
        <div className='task_card_tags'>
          {tags.map((tag, i) => (
            <span key={i} className="tag" style={{ backgroundColor: getTagColor(tag) }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="task_actions">
          <button 
            className="edit_btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
          >
            Edit
          </button>
          <button 
            className="delete_btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};



export default TaskCard;