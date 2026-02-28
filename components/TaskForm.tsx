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
      const response = await axios.post('/api/tasks', { title, description, dueDate: dueDate ? new Date(dueDate) : undefined });
      dispatch(addTask(response.data));
      setTitle(''); setDescription(''); setDueDate('');
    } catch (error) {} finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-all">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Plus className="text-blue-600 dark:text-blue-400" /> Add New Task
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Type className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Task Title..." value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-white font-medium" />
        </div>
        <div className="flex-1 relative">
          <AlignLeft className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Short Description..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-white" />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 dark:text-gray-300 cursor-pointer" />
        </div>
        <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:opacity-90 disabled:opacity-70 transition-all font-bold">
          {loading ? '...' : 'Add'}
        </button>
      </div>
    </form>
  );
}