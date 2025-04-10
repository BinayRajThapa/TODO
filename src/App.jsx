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
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);


  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (['/login', '/signup'].includes(window.location.pathname)) {
        return;
      }
    
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
      } else {
        if (!['/login', '/signup'].includes(window.location.pathname)) {
          navigate("/login");
        }
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
        const userData = {
          email: response.user.email,
          name: response.user.name,
          id: response.user.id,
          themeColor: response.user.themeColor
        };
        dispatch(login(userData));
        toast.success(`Welcome ${response.user.name}!`);
        navigate("/");
      } else {
        setAuthError(response.message || "Signup failed");
        toast.error(response.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("Signup failed. Please try again.");
      toast.error("Signup failed. Please try again.");
    }
  };
  
  // Task operation handlers
  const handleDeleteClick = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return toast.error("Task not found!");
    setTaskToDelete(taskIndex);
    setShowDeleteConfirm(true);
  };
  

  const confirmDelete = () => {
    dispatch(deleteTask(taskToDelete));
    setShowDeleteConfirm(false);
    toast.success("Task deleted!")
  };

  const deleteSelectedTasks = () => {
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    dispatch(updateTasks(updatedTasks));
    setSelectedTasks([]);
    toast.success(`Deleted ${selectedTasks.length} task(s)`);
  };

  const handleEditClick = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return toast.error("Task not found!");
  
    setTaskToEdit(taskIndex);
    setOriginalText(tasks[taskIndex].task);
    setEditedText(tasks[taskIndex].task);
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

  const handleSelectAll = (status) => {
    const columnTaskIds = tasks
      .filter(task => task.status === status)
      .map(task => task.id);
  
    const allSelected = columnTaskIds.every(id => selectedTasks.includes(id));
  
    setSelectedTasks(prev =>
      allSelected
        ? prev.filter(id => !columnTaskIds.includes(id))
        : [...new Set([...prev, ...columnTaskIds])]
    );
  
    const statusName = {
      todo: "To Do",
      doing: "In Progress",
      done: "Completed"
    };
  
    toast.success(
      allSelected 
        ? `Unselected all from "${statusName[status]}"`
        : `Selected all from "${statusName[status]}"`
    );
  };
  
  

  // Drag-and-drop handler
  const onDrop = (status, position) => {
    if (activeCard === null) return;
  
    const taskToMove = tasks.find(task => task.id === activeCard);
    const filteredTasks = tasks.filter(task => task.id !== activeCard);
  
    filteredTasks.splice(position, 0, {
      ...taskToMove,
      status: status
    });
  
    dispatch(updateTasks(filteredTasks));
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
        }/>

        
        <Route path="/" element={
          isAuthenticated ? (
            <>
              <div className="top-header">
                <UserDropdown />
              </div>

              <TaskForm />

              <div className="bulk-toolbar">
                <button
                  className="bulk-delete-btn"
                  onClick={() => {
                    if (selectedTasks.length === 0) {
                      toast.error("No tasks selected");
                      return;
                    }
                    setShowBulkDeleteConfirm(true);
                  }}
                >
                  Delete Selected
                </button>
              </div>

                            
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
                    selectedTasks={selectedTasks}
                    onSelectAll={handleSelectAll}
                    onToggleSelect={toggleTaskSelection}
                  />
                  <TaskColumn
                    title="In Progress Tasks"
                    tasks={tasks}
                    status="doing"
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                    selectedTasks={selectedTasks}
                    onSelectAll={handleSelectAll}
                    onToggleSelect={toggleTaskSelection}
                  />
                  <TaskColumn
                    title="Completed Tasks"
                    tasks={tasks}
                    status="done"
                    setActiveCard={setActiveCard}
                    onDrop={onDrop}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                    selectedTasks={selectedTasks}
                    onSelectAll={handleSelectAll}
                    onToggleSelect={toggleTaskSelection}
                  />
                </div>

                {/*{selectedTasks.length > 0 && (
                /<div className="bulk-actions">
                  <button 
                    onClick={deleteSelectedTasks}
                    className="delete-selected-btn"
                  >
                    Delete Selected ({selectedTasks.length})
                  </button>
                </div>*/}
              
              </main>

              {/* Delete Confirmation Modal */}
              <DeleteModal
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                taskIndex={taskToDelete}
              />

              <DeleteModal
                show={showBulkDeleteConfirm}
                onHide={() => setShowBulkDeleteConfirm(false)}
                onConfirm={() => {
                  deleteSelectedTasks();
                  setShowBulkDeleteConfirm(false);
                }}
                customText={`Are you sure you want to delete ${selectedTasks.length} selected task(s)? This action cannot be undone.`}
                customTitle="Delete Selected Tasks"
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