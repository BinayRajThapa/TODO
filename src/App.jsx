import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import { updateTasks, deleteTask } from './store/tasksSlice';
import TaskForm from "./components/TaskForm";
import TaskColumn from "./components/TaskColumn";
import DeleteModal from "./components/DeleteModal";
import EditModal from './components/EditModal';
import AuthForm from "./components/AuthForm";
import UserDropdown from "./components/UserDropdown";
import { authService } from "./utils/auth";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";



const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(state => state.tasks);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [activeCard, setActiveCard] = useState(null);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [originalText, setOriginalText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.email) {
            dispatch(login(parsedUser));
            if (window.location.pathname !== '/') {
              navigate("/");
            }
          }
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      
      if (!userData && window.location.pathname !== '/login') {
        navigate("/login");
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  // Authentication handlers
  const handleLogin = async (formData) => {
    try {
      setAuthError("");
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        dispatch(login(response.user));
        toast.success(`Welcome back, ${response.user.name}!`);
        navigate("/");
      } else {
        setAuthError(response.message);
      }
    } catch (error) {
      setAuthError("An unexpected error occurred");
    }
  };

  const handleSignup = async (formData) => {
    try {
      setAuthError("");
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password
      );

      if (response.success) {
        dispatch(login(response.user));
        navigate("/");
      } else {
        setAuthError(response.message || "Signup failed");
      }
    } catch (error) {
      setAuthError(error.message || "Signup error");
    }
  };

  // Task operation handlers
  const handleDeleteClick = (index) => {
    setTaskToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(taskToDelete));
    setShowDeleteConfirm(false);
    toast.success("Task deleted!")
  };

  const handleEditClick = (index) => {
    setTaskToEdit(index);
    setOriginalText(tasks[index].task);
    setEditedText(tasks[index].task);
    setShowEditConfirm(true);
  };

  const confirmEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[taskToEdit] = {
      ...updatedTasks[taskToEdit],
      task: editedText
    };
    dispatch(updateTasks(updatedTasks));
    setShowEditConfirm(false);
    toast.success("Task updated!");
  };

  // Drag-and-drop handler
  const onDrop = (status, position) => {
    if (activeCard === null) return;

    const taskToMove = tasks[activeCard];
    const updatedTasks = tasks.filter((_, index) => index !== activeCard);
    
    updatedTasks.splice(position, 0, {
      ...taskToMove,
      status: status
    });

    dispatch(updateTasks(updatedTasks));
    setActiveCard(null);

    const statusName = {
      todo: "To Do",
      doing: "In Progress",
      done: "Completed"
    };
  
    toast.success(`Task moved to "${statusName[status]}"`);
  };

  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? (
            <AuthForm 
              type="login" 
              onSubmit={handleLogin} 
              error={authError}
              clearError={() => setAuthError("")}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        <Route path="/signup" element={
          !isAuthenticated ? (
            <AuthForm 
              type="signup" 
              onSubmit={handleSignup} 
              error={authError}
              clearError={() => setAuthError("")}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        <Route path="/" element={
          isAuthenticated ? (
            <>
              <div className="top-header">
                <UserDropdown />
              </div>

              <TaskForm />
              
              <main className="app_main">
                <div className="columns_container">
                  <TaskColumn
                    title="To Do Tasks"
                    tasks={tasks}
                    status="todo"
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                  />
                  <TaskColumn
                    title="In Progress Tasks"
                    tasks={tasks}
                    status="doing"
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                  />
                  <TaskColumn
                    title="Completed Tasks"
                    tasks={tasks}
                    status="done"
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                  />
                </div>
              </main>

              {/* Delete Confirmation Modal */}
              <DeleteModal 
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                taskIndex={taskToDelete}
              />


              {/* Edit Confirmation Modal */}
              <EditModal
                show={showEditConfirm}
                onHide={() => setShowEditConfirm(false)}
                onConfirm={confirmEdit}
                taskIndex={taskToEdit}
                editedText={editedText}
                setEditedText={setEditedText}
            />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </div>
  );
};

export default App;