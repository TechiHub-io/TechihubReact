// src/components/ui/Input.jsx
export default function Input({ label, className = '', ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border border-gray-300 rounded-md ${className}`}
        {...props}
      />
    </div>
  );
}