// store/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  dateFilter: 'all', // 'all', 'today', 'upcoming', 'overdue'
  statusFilter: 'all', // 'all', 'To Do', 'In Progress', 'Done'
  isLoading: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    setFilters: (state, action) => {
      state.dateFilter = action.payload.date || state.dateFilter;
      state.statusFilter = action.payload.status || state.statusFilter;
    }
  }
});

export const { setTasks, addTask, updateTask, deleteTask, setFilters } = taskSlice.actions;
export default taskSlice.reducer;