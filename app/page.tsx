"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, updateTask, deleteTask } from '@/store/taskSlice';
import axios from 'axios';
import TaskForm from '@/components/TaskForm';
import FilterBar from '@/components/FilterBar';
import { Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { isToday, isFuture, isPast, startOfDay } from 'date-fns';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export default function Home() {
  const dispatch = useDispatch();
  
  // Redux state se typeFilter aur baaki filters nikalna
  const { tasks, statusFilter, dateFilter, searchQuery, typeFilter } = useSelector((state: any) => state.tasks);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      dispatch(setTasks(response.data));
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchTasks(); }, [dispatch]);

  const handleJiraSync = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.get('/api/jira');
      alert(response.data.message);
      await fetchTasks();
    } catch (error) { alert("Sync failed."); }
    finally { setIsSyncing(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;
    try { await axios.delete(`/api/tasks/${id}`); dispatch(deleteTask(id)); } catch (error) {}
  };

  const handleStatusChange = async (task: any, newStatus: string) => {
    try {
      const response = await axios.put(`/api/tasks/${task._id}`, { status: newStatus });
      dispatch(updateTask(response.data));
    } catch (error) {}
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    const taskToUpdate = tasks.find((t: any) => t._id === draggedTaskId);
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      handleStatusChange(taskToUpdate, newStatus);
    }
    setDraggedTaskId(null);
  };

  // Search, Filter Logic (Aapka Naya Update)
  const finalTasks = tasks.filter((task: any) => {
    
    // 1. NAYA: Type Filter Logic (Personal vs Jira)
    if (typeFilter === 'personal' && task.isJiraTicket) return false;
    if (typeFilter === 'jira' && !task.isJiraTicket) return false;

    // 2. Status Filter
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    
    // 3. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(query);
      const matchDesc = task.description?.toLowerCase().includes(query);
      const matchJiraId = task.jiraTicketId?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchJiraId) return false;
    }
    
    // 4. Date Filter
    if (dateFilter !== 'all') {
      if (!task.dueDate) return false;
      const dueDate = startOfDay(new Date(task.dueDate));
      if (dateFilter === 'today' && !isToday(dueDate)) return false;
      if (dateFilter === 'upcoming' && !isFuture(dueDate)) return false;
      if (dateFilter === 'overdue' && (!isPast(dueDate) || isToday(dueDate) || task.status === 'Done')) return false;
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">
              🚀 Vijju Todo's Pro
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Drag & Drop Kanban Board</p>
          </div>
          <button onClick={handleJiraSync} disabled={isSyncing} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all font-semibold">
            <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Syncing...' : 'Sync Jira'}
          </button>
        </div>
        
        <TaskForm />
        <FilterBar />

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(columnStatus => {
            const columnTasks = finalTasks.filter((t: any) => t.status === columnStatus);
            
            return (
              <div 
                key={columnStatus}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnStatus)}
                className="bg-gray-100/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[400px] flex flex-col"
              >
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                    {columnStatus}
                  </h2>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full text-sm font-bold">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  {columnTasks.map((task: any) => (
                    <div 
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${draggedTaskId === task._id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`font-bold text-lg ${task.status === 'Done' ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <button onClick={() => handleDelete(task._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {task.isJiraTicket && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <a href={task.jiraTicketUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                            {task.jiraTicketId} <ExternalLink size={10} />
                          </a>
                          {task.jiraStatus && (
                            <span className="text-[11px] font-bold text-purple-700 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-1 rounded">
                              {task.jiraStatus}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {task.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">{task.description}</p>}
                      {task.dueDate && (
                        <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700/50 inline-block px-2 py-1 rounded border border-blue-100 dark:border-gray-600">
                          🗓️ Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-400 dark:text-gray-500 font-medium">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}