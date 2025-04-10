import React from "react";
import { useSelector } from 'react-redux'; 
import TaskCard from "./TaskCard";
import DropArea from "./DropArea";
import "./TaskColumn.css";

const TaskColumn = ({ title, tasks, status, onDelete, onEdit, setActiveCard, onDrop }) => {
  const { user } = useSelector(state => state.auth); 

  return (
    <section className='task_column' data-status={status}>
      <h2 className='task_column_heading'>{title}</h2>
      
      <DropArea onDrop={() => onDrop(status, 0)} />
      
      {tasks.map((task, index) => 
        task.status === status && task.owner === user?.email && ( 
          <React.Fragment key={index}>
            <TaskCard
              title={task.task}
              tags={task.tags}
              index={index}
              setActiveCard={setActiveCard}
              onDelete={onDelete}
              onEdit={onEdit}
            />
            <DropArea onDrop={() => onDrop(status, index + 1)} />
          </React.Fragment>
        )
      )}
    </section>
  );
};

export default TaskColumn;