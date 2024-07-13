'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

const data = [
  {
    id: 1,
    url: '/images/dashboard/dashboard.svg',
    text: 'Dashboard',
    redirect: '/dashboard',
  },
  // {
  //   id: 2,
  //   url: '/images/dashboard/briefcase.svg',
  //   text: 'Applied Jobs',
  //   redirect: '/applied-jobs',
  // },
  // {
  //   id: 3,
  //   url: '/images/dashboard/bookmark.svg',
  //   text: 'Favourite Jobs',
  //   redirect: '/favourite-jobs',
  // },
  // {
  //   id: 4,
  //   url: '/images/dashboard/bell.svg',
  //   text: 'Job Alerts',
  //   redirect: '/job-alerts',
  // },
  {
    id: 2,
    url: '/images/dashboard/settings.svg',
    text: 'Edit Profile',
    redirect: '/settings',
  },
  {
    id: 3,
    url: '/images/dashboard/user.svg',
    text: 'My Profile',
    redirect: '/user-profile',
  },
];

interface Datatypes {
  readonly id: number;
  readonly url: string;
  readonly text: string;
  readonly redirect: string;
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const MenuItem = ({ dat }: { dat: Datatypes }) => (
    <li key={dat.id} className="w-full bg-white">
      <Link
        href={dat.redirect}
        className={`flex items-center p-4 ${
          pathname === dat.redirect ? 'bg-[#88FF99] bg-opacity-40' : ''
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Image
          src={dat.url}
          className="mr-4"
          alt={dat.text}
          width={24}
          height={24}
        />
        <span className="text-sm font-medium text-black opacity-70">
          {dat.text}
        </span>
      </Link>
    </li>
  );

  return (
    <section className="flex flex-col xl:flex-row">
      <aside className="w-full xl:w-64 sticky top-0 z-10">
        {isMobile ? (
          <div className="sticky top-0 bg-white shadow-xl">
            <button
              onClick={toggleDropdown}
              className="w-full p-4 bg-white border-b flex justify-between items-center"
            >
              <span>Menu</span>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && (
              <ul className="max-h-[calc(100vh-64px)] overflow-y-auto bg-white border-b shadow-lg">
                {data.map((dat) => (
                  <MenuItem key={dat.id} dat={dat} />
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="sticky top-0 max-h-screen overflow-y-auto bg-white shadow-xl">
            <ul className="flex flex-col w-full">
              {data.map((dat) => (
                <MenuItem key={dat.id} dat={dat} />
              ))}
            </ul>
          </div>
        )}
      </aside>
      <main className="flex-1 p-6 xl:ml-4">
        {children}
      </main>
    </section>
  );
}