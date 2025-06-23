// src/app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}