import { createSlice } from '@reduxjs/toolkit';

const saveTasks = (tasks) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.email) {
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasks[user.email] = tasks; 
    localStorage.setItem('tasks', JSON.stringify(allTasks));
  }
};

const loadInitialTasks = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
  return user?.email ? allTasks[user.email] || [] : [];
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadInitialTasks(),
  reducers: {
    addTask: (state, action) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) return state;
      
      const newTask = {
        ...action.payload,
        owner: user.email,
        id: Date.now().toString()
      };
      const newState = [...state, newTask]; 
      saveTasks(newState);
      return newState; 
      


},
    updateTasks: (state, action) => {
      const newState = action.payload;
      saveTasks(newState);
      return newState;
    },
    deleteTask: (state, action) => {
      const newState = state.filter((_, index) => index !== action.payload);
      saveTasks(newState);
      return newState;
    },
  
    clearTasks: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) {
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        delete allTasks[user.email];
        localStorage.setItem('tasks', JSON.stringify(allTasks));
      }
      return [];
    }
  }
});


export const selectTasksByStatus = (status) => (state) => 
  state.tasks.filter(task => task.status === status);
export const { addTask, updateTasks, deleteTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;