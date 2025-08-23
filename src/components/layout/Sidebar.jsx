// src/components/layout/Sidebar.jsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ userRole = 'jobseeker' }) {
  const pathname = usePathname();

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

  const links = userRole === 'employer' ? employerLinks : jobseekerLinks;

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