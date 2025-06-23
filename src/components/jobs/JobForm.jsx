// src/components/jobs/JobForm.jsx
import { useState } from 'react';

export default function JobForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    type: 'full-time',
    experience: 'mid',
    salary_min: '',
    salary_max: '',
    skills: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full h-32"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Requirements</label>
        <textarea
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          className="w-full h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Responsibilities</label>
        <textarea
          value={formData.responsibilities}
          onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
          className="w-full h-32"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full"
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Minimum Salary</label>
          <input
            type="number"
            value={formData.salary_min}
            onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Maximum Salary</label>
          <input
            type="number"
            value={formData.salary_max}
            onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Experience Level</label>
        <select
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="w-full"
        >
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="executive">Executive Level</option>
        </select>
      </div>

      <button type="submit" className="withborder">
        {initialData ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
}