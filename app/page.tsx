"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, updateTask, deleteTask } from '@/store/taskSlice';
import axios from 'axios';
import TaskForm from '@/components/TaskForm';
import FilterBar from '@/components/FilterBar';
import { Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { isToday, isFuture, isPast, startOfDay } from 'date-fns';

export default function Home() {
  const dispatch = useDispatch();
  // State se tasks aur filters dono nikal rahe hain
  const { tasks, statusFilter, dateFilter } = useSelector((state: any) => state.tasks);

  // 1. Database se tasks fetch karna
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        dispatch(setTasks(response.data));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [dispatch]);

  // 2. Task delete karna
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/api/tasks/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // 3. Task ka status update karna
  const handleStatusChange = async (task: any, newStatus: string) => {
    try {
      const response = await axios.put(`/api/tasks/${task._id}`, { status: newStatus });
      dispatch(updateTask(response.data));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 4. Filtering Logic (Status + Date)
  const filteredTasks = tasks.filter((task: any) => {
    // Status Filter Check
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;

    // Date Filter Check
    if (dateFilter !== 'all') {
      if (!task.dueDate) return false; // Bina date wale task hide ho jayenge
      
      const dueDate = startOfDay(new Date(task.dueDate));
      
      if (dateFilter === 'today' && !isToday(dueDate)) return false;
      if (dateFilter === 'upcoming' && !isFuture(dueDate)) return false;
      // Overdue condition: date nikal chuki ho aur status Done na ho
      if (dateFilter === 'overdue' && (!isPast(dueDate) || isToday(dueDate) || task.status === 'Done')) return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-3 tracking-tight">
            🚀 Vijju Todo Board
          </h1>
          <p className="text-gray-500 text-lg">Manage your workflow efficiently.</p>
        </div>
        
        {/* Components */}
        <TaskForm />
        <FilterBar />

        {/* Task List Section */}
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Your Tasks <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{filteredTasks.length}</span>
          </h2>
          
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg font-medium">Koi task nahi mila is filter ke hisaab se.</p>
            </div>
          ) : (
            filteredTasks.map((task: any) => (
              <div key={task._id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-5 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {task.status === 'Done' ? <CheckCircle2 className="text-green-500" size={24} /> : 
                     task.status === 'In Progress' ? <Clock className="text-yellow-500" size={24} /> : 
                     <Circle className="text-gray-400" size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-xl ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    {task.description && <p className="text-gray-500 text-base mt-1 line-clamp-2">{task.description}</p>}
                    {task.dueDate && (
                      <span className="inline-block mt-3 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        🗓️ Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className={`text-sm font-bold rounded-xl px-4 py-2 border cursor-pointer outline-none transition-colors
                      ${task.status === 'Done' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 
                        task.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' : 
                        'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Task"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}