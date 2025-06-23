// src/components/auth/RegisterForm.jsx
import { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isEmployer: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic will be implemented here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="mt-1 block w-full"
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="mt-1 block w-full"
          placeholder="Enter your last name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full"
          placeholder="Enter your password"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isEmployer}
          onChange={(e) => setFormData({ ...formData, isEmployer: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm">I am an employer</label>
      </div>
      <button type="submit" className="withborder">
        Register
      </button>
    </form>
  );
}