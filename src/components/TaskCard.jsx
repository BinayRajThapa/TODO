import React from "react";
import { TAG_COLORS } from '../utils/constants';
import "./TaskCard.css";

const getTagColor = (tag) => TAG_COLORS[tag] || '#6457f9';
const TaskCard = ({ title, tags, index, setActiveCard, onDelete, onEdit }) => {
  return (
    <article 
      className='task_card' 
      draggable 
      onDragStart={() => setActiveCard(index)}
      onDragEnd={() => setActiveCard(null)}
    >
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
              onEdit(index);
            }}
          >
            Edit
          </button>
          <button 
            className="delete_btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
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