"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '@/store/taskSlice';
import axios from 'axios';
import { Plus, CalendarDays, Type, AlignLeft } from 'lucide-react';

export default function TaskForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/tasks', {
        title, description, dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      dispatch(addTask(response.data));
      setTitle(''); setDescription(''); setDueDate('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 transition-all hover:shadow-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="text-blue-600" /> Create New Task
      </h2>
      
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Type className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" placeholder="Task Title (e.g., Code review karna hai)" value={title}
            onChange={(e) => setTitle(e.target.value)} required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 font-medium"
          />
        </div>

        <div className="relative">
          <AlignLeft className="absolute left-3 top-3 text-gray-400" size={20} />
          <textarea 
            placeholder="Description (Optional)" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 resize-none h-24"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-2">
          <div className="relative w-full sm:w-auto flex-1">
            <CalendarDays className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 cursor-pointer"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl flex justify-center items-center gap-2 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 shadow-lg hover:shadow-blue-500/30 transition-all font-semibold"
          >
            {loading ? 'Saving...' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
}