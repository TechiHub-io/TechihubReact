// src/components/jobs/JobSearchFilter.jsx
import { useState } from 'react';

export default function JobSearchFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Keyword</label>
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            placeholder="Job title, skills..."
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="City or remote"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="w-full"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>
      </div>
      <button type="submit" className="withborder mt-4">
        Apply Filters
      </button>
    </form>
  );
}