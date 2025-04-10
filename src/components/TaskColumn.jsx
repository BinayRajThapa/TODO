import React from "react";
import { useSelector } from 'react-redux'; 
import TaskCard from "./TaskCard";
import DropArea from "./DropArea";
import "./TaskColumn.css";

const TaskColumn = ({ 
  title, 
  tasks, 
  status, 
  onDelete, 
  onEdit, 
  setActiveCard, 
  onDrop,
  selectedTasks = [], 
  onSelectAll,
  onToggleSelect 
}) => {
  const { user } = useSelector(state => state.auth);
  
  const columnTasks = tasks
    .map((task, index) => ({ ...task, originalIndex: index }))
    .filter(task => task.status === status && task.owner === user?.email);

  const allSelected = columnTasks.length > 0 && 
  columnTasks.every(task => selectedTasks.includes(task.id));

  return (
    <section className='task_column' data-status={status}>
      <div className="column-header">
        <h2 className='task_column_heading'>{title}</h2>
        {columnTasks.length > 0 && (
          <button 
            onClick={() => onSelectAll(status)}
            className="select-all-btn"
          >
            {allSelected ? 'Unselect All' : 'Select All'}
          </button>
        )}
      </div>
      
      <DropArea onDrop={() => onDrop(status, 0)} />
      
      {columnTasks.map(( task, i ) => (
        <React.Fragment key={task.id}>
          <TaskCard
            title={task.task}
            tags={task.tags}
            id={task.id}
            setActiveCard={setActiveCard}
            onDelete={onDelete}
            onEdit={onEdit}
            isSelected={selectedTasks.includes(task.id)}
            onToggleSelect={onToggleSelect}
          />
          <DropArea onDrop={() => onDrop(status, i + 1)} />
        </React.Fragment>
      ))}
    </section>
  );
};

export default TaskColumn;