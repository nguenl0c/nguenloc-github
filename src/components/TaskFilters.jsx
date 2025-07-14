import { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";

export default function TaskFilters({
  onFilterChange,
  onSearchChange,
  statuses = [],
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleStatusFilterChange = e => {
    const value = e.target.value;
    setStatusFilter(value);
    onFilterChange('status', value);
  };

  const handlePriorityFilterChange = e => {
    const value = e.target.value;
    setPriorityFilter(value);
    onFilterChange('priority', value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    onSearchChange('');
    onFilterChange('status', 'all');
    onFilterChange('priority', 'all');
  };

  return (
    <div className="bg-white rounded-lg px-3 py-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search tasks by title or assignee..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-700 text-xl">
                <IoIosSearch />
              </span>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="min-w-36">
            
          <select
            
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          > 
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status.id || status.name} value={status.name}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="min-w-36">
          <select 
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Quick Stats */}
    </div>
  );
}
