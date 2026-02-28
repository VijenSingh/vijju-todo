import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  dateFilter: 'all',
  statusFilter: 'all',
  searchQuery: '',
  typeFilter: 'all', // NAYA: Task type filter (all, personal, jira)
  isLoading: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => { state.tasks = action.payload; },
    addTask: (state, action) => { state.tasks.push(action.payload); },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    setFilters: (state, action) => {
      if (action.payload.date !== undefined) state.dateFilter = action.payload.date;
      if (action.payload.status !== undefined) state.statusFilter = action.payload.status;
      if (action.payload.searchQuery !== undefined) state.searchQuery = action.payload.searchQuery;
      if (action.payload.type !== undefined) state.typeFilter = action.payload.type; // NAYA LOGIC
    }
  }
});

export const { setTasks, addTask, updateTask, deleteTask, setFilters } = taskSlice.actions;
export default taskSlice.reducer;