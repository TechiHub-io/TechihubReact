// src/components/company/CompanyForm.jsx
import { useState } from 'react';

export default function CompanyForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    size: '',
    founding_date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        <label className="block text-sm font-medium mb-1">Industry</label>
        <input
          type="text"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
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
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company Size</label>
          <select
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="w-full"
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001+">1001+ employees</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Founding Date</label>
        <input
          type="date"
          value={formData.founding_date}
          onChange={(e) => setFormData({ ...formData, founding_date: e.target.value })}
          className="w-full"
        />
      </div>

      <button type="submit" className="withborder">
        {initialData ? 'Update Company' : 'Create Company'}
      </button>
    </form>
  );
}