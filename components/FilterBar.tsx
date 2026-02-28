"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/store/taskSlice';
import { Search, Moon, Sun } from 'lucide-react';

export default function FilterBar() {
  const dispatch = useDispatch();
  const { statusFilter, dateFilter, searchQuery, typeFilter } = useSelector((state: any) => state.tasks);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center transition-all">
      
      {/* Search Bar */}
      <div className="relative w-full lg:w-1/4">
        <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => dispatch(setFilters({ searchQuery: e.target.value }))}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 transition-all"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center flex-wrap justify-center">
        
        {/* NAYA: Premium Type Switch (All / Personal / Jira) */}
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-full sm:w-auto justify-between border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => dispatch(setFilters({ type: 'all' }))}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none ${typeFilter === 'all' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            All Tasks
          </button>
          <button
            onClick={() => dispatch(setFilters({ type: 'personal' }))}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none ${typeFilter === 'personal' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Personal
          </button>
          <button
            onClick={() => dispatch(setFilters({ type: 'jira' }))}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none ${typeFilter === 'jira' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Jira Only
          </button>
        </div>

        <select value={statusFilter} onChange={(e) => dispatch(setFilters({ status: e.target.value }))} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2.5 outline-none w-full sm:w-auto font-medium cursor-pointer">
          <option value="all">All Status</option><option value="To Do">To Do</option><option value="In Progress">In Progress</option><option value="Done">Done</option>
        </select>
        <select value={dateFilter} onChange={(e) => dispatch(setFilters({ date: e.target.value }))} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2.5 outline-none w-full sm:w-auto font-medium cursor-pointer">
          <option value="all">All Dates</option><option value="today">Today</option><option value="upcoming">Upcoming</option><option value="overdue">Overdue</option>
        </select>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDark} className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-yellow-400 transition-all border border-transparent dark:border-gray-600">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}