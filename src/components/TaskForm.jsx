import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'; 
import { addTask } from '../store/tasksSlice';
import { toast } from 'react-hot-toast'; 
import "./TaskForm.css";

const TaskForm = () => {
  const [taskInput, setTaskInput] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskInput.trim()) {
      toast.error("Task cannot be empty!"); 
      return;
    }

    dispatch(addTask({
      task: taskInput,
      status: "todo",
      tags: []
    }));
    
    toast.success("Task added!");
    setTaskInput("");
  };

  return (
    <header className="app_header">
      <div className="todo_header">
        <h1>ToDo List</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input_row">
          <input
            type="text"
            value={taskInput}
            className="task_input"
            placeholder="Keep Yourself Motivated by adding the task..."
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button type="submit" className="task_submit">
            Add
          </button>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
