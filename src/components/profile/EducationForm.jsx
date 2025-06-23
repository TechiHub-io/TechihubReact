// src/components/profile/EducationForm.jsx
import { useState } from 'react';

export default function EducationForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    current: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Institution</label>
        <input
          type="text"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Degree</label>
        <select
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          className="w-full"
          required
        >
          <option value="">Select degree</option>
          <option value="diploma">Diploma</option>
          <option value="certificate">Certificate</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="postgraduate">Postgraduate</option>
          <option value="masters">Masters</option>
          <option value="doctorate">Doctorate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Field of Study</label>
        <input
          type="text"
          value={formData.field_of_study}
          onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
          className="w-full"
          required
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
            disabled={formData.current}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.current}
          onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm">Currently studying here</label>
      </div>

      <div className="flex space-x-4">
        <button type="submit" className="withborder">
          {initialData ? 'Update Education' : 'Add Education'}
        </button>
        <button type="button" onClick={onCancel} className="borderless">
          Cancel
        </button>
      </div>
    </form>
  );
}