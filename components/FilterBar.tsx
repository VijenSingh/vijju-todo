"use client";
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '@/store/taskSlice';
import { Filter } from 'lucide-react';

export default function FilterBar() {
  const dispatch = useDispatch();
  const { statusFilter, dateFilter } = useSelector((state: any) => state.tasks);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center transition-all hover:shadow-md">
      <div className="flex items-center gap-2 text-gray-700 font-bold text-lg w-full sm:w-auto">
        <Filter size={22} className="text-blue-600" />
        <span>Filters</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1 justify-end">
        {/* Status Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-semibold cursor-pointer transition-all hover:bg-gray-100"
        >
          <option value="all">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {/* Date Filter Dropdown */}
        <select
          value={dateFilter}
          onChange={(e) => dispatch(setFilters({ date: e.target.value }))}
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-semibold cursor-pointer transition-all hover:bg-gray-100"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
}