// src/components/auth/PasswordReset.jsx
import { useState } from 'react';

export default function PasswordReset() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Password reset logic will be implemented here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full"
          placeholder="Enter your email"
        />
      </div>
      <button type="submit" className="withborder">
        Reset Password
      </button>
    </form>
  );
}