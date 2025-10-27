// src/components/layout/Sidebar.jsx
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function Sidebar({ userRole = 'jobseeker' }) {
  const pathname = usePathname();
  const { isAdmin, hasAccessibleCompanies } = useAdminAuth();

  const jobseekerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/jobs', label: 'Find Jobs', icon: '🔍' },
    { href: '/applications', label: 'Applications', icon: '📝' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const employerLinks = [
    { href: '/dashboard/employer', label: 'Dashboard', icon: '🏠' },
    { href: '/jobs/create', label: 'Post Job', icon: '➕' },
    { href: '/company', label: 'Company', icon: '🏢' },
    { href: '/dashboard/employer/applications', label: 'Applications', icon: '📝' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: '🛡️' },
    { href: '/admin/post-job', label: 'Post Job for Company', icon: '📝' },
    { href: '/admin/manage-jobs', label: 'Manage Posted Jobs', icon: '📊' },
    { href: '/admin/companies', label: 'Company Access', icon: '🏢' },
    { href: '/messages', label: 'Messages', icon: '💬' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  // Determine which links to show based on user role and admin status
  let links = jobseekerLinks;
  if (isAdmin) {
    links = adminLinks;
  } else if (userRole === 'employer') {
    links = employerLinks;
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <div className="p-4">
        <Link href="/" className="text-2xl font-bold text-[#0CCE68]">
           <Image 
                src="/images/blogs/logoa.webp"
                alt="TechHub"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-110"
              />
        </Link>
      </div>
      
      <nav className="mt-6">
        {isAdmin && (
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 mb-2">
            Admin Panel
            {!hasAccessibleCompanies && (
              <div className="mt-1 text-xs text-amber-600 normal-case">
                No company access
              </div>
            )}
          </div>
        )}
        
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#0CCE68] ${
                isActive ? 'bg-gray-100 text-[#0CCE68]' : ''
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}