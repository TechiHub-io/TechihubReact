// src/components/profile/ExperienceForm.jsx
import { useState } from 'react';

export default function ExperienceForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    company_name: '',
    job_title: '',
    location: '',
    start_date: '',
    end_date: '',
    current_job: false,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          value={formData.job_title}
          onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full"
            disabled={formData.current_job}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.current_job}
          onChange={(e) => setFormData({ ...formData, current_job: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm">I currently work here</label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full h-32"
        />
      </div>

      <div className="flex space-x-4">
        <button type="submit" className="withborder">
          {initialData ? 'Update Experience' : 'Add Experience'}
        </button>
        <button type="button" onClick={onCancel} className="borderless">
          Cancel
        </button>
      </div>
    </form>
  );
}