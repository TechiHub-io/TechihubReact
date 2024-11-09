'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import BouncingCirclesLoader from '@/components/animations/BouncingCircleLoader';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfilePhoto } from '../user-profile/hooks/ProfilePhotoHandling';

const data = [
  {
    id: 1,
    url: '/images/dashboard/dashboard.svg',
    text: 'Dashboard',
    redirect: '/dashboard',
  },
  {
    id: 2,
    url: '/images/dashboard/briefcase.svg',
    text: 'Applied Jobs',
    redirect: '/applied-jobs',
  },
  {
    id: 3,
    url: '/images/dashboard/bookmark.svg',
    text: 'Favourite Jobs',
    redirect: '/favourite-jobs',
  },
  {
    id: 4,
    url: '/images/dashboard/bell.svg',
    text: 'Job Alerts',
    redirect: '/job-alerts',
  },
  {
    id: 5,
    url: '/images/dashboard/message.svg',
    text: 'Messages',
    redirect: '/messages',
  },
  {
    id: 6,
    url: '/images/dashboard/settings.svg',
    text: 'Settings',
    redirect: '/settings',
  },
  {
    id: 7,
    url: '/images/dashboard/user.svg',
    text: 'Profile',
    redirect: '/user-profile',
  },
  {
    id: 8,
    url: '/images/dashboard/help.svg',
    text: 'Customer Support',
    redirect: '/support',
  }
];

interface DataTypes {
  readonly id: number;
  readonly url: string;
  readonly text: string;
  readonly redirect: string;
}

const ShimmerEffect = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-10 bg-gray-200 rounded w-full"></div>
    ))}
  </div>
);

const decodeProfilePhotoUrl = (url: string) => {
  return url ? url.replace(/%2f/gi, '/') : '';
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession();

   // @ts-ignore
   const userId = session?.user?.userId;
  //  get image from user profile data
  const { data : profileData, isLoading, error } = Swrgetdat(`/api/user-profile/${userId}`);
 
  if (isLoading) return <div><BouncingCirclesLoader /></div>;
  if (error) return <div>Error loading profile</div>;

  const userProfile = profileData?.userProfile;
  const name = `${userProfile.first_name} ${userProfile.last_name}`;
  console.log("sessionimage", decodeProfilePhotoUrl(userProfile.profile_photo_url))

  // download and get data 
  const { photoUrl, isLoading: getLoading, error: getError } = useProfilePhoto(decodeProfilePhotoUrl(userProfile.profile_photo_url));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const MenuItem = ({ dat }: { dat: DataTypes }) => (
    <li key={dat.id} className="w-full">
      <Link
        href={dat.redirect}
        className={`flex items-center px-6 py-3 hover:bg-[#88FF99] hover:bg-opacity-20 transition-colors duration-200 ${
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
        <span className="text-sm font-medium text-gray-700">
          {dat.text}
        </span>
      </Link>
    </li>
  );

  // Loading state
  if (status === "loading") {
    return (
      <section className="flex flex-col xl:flex-row">
        <aside className="w-full xl:w-64 sticky top-0 z-10 bg-white shadow-xl">
          <ShimmerEffect />
        </aside>
        <main className="flex-1 p-1 md:p-4 lg:p-6 xl:ml-4">
          {children}
        </main>
      </section>
    );
  }

  const desktopSidebar = (
    <div className="sticky top-0 xl:w-72 h-full bg-white shadow-xl flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b">
        <div className="flex items-center flex-col justify-center ">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Avatar className="w-12 h-12 mb-4">
            {isLoading ? (
              <AvatarFallback>...</AvatarFallback>
            ) : error ? (
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            ) : (
              <AvatarImage 
                src={photoUrl || ''} 
                alt={name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Show fallback
                  const fallback = target.nextElementSibling;
                  if (fallback) {
                    fallback.setAttribute('data-state', 'visible');
                  }
                }}
              />
            )}
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-center text-gray-900 truncate">
              {session?.user?.name || 'User'}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {session?.user?.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {data.map((dat) => (
            <MenuItem key={dat.id} dat={dat} />
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <Link
          href="/api/auth/signout"
          className="flex items-center px-6 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col xl:flex-row ">
      <aside className="w-full xl:block xl:w-72 sticky !top-16 xl:fixed xl:mt-20 xl:inset-y-0 z-10" >
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
                <div className="p-4 border-t">
                  <Link
                    href="/api/auth/signout"
                    className="flex items-center px-6 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">Logout</span>
                  </Link>
                </div>
              </ul>

            )}
            
          </div>
        ) : (
          desktopSidebar
        )}
      </aside>
      <main className="flex-1 xl:ml-72 p-1 xl:min-h-screen xl:overflow-y-auto">
        {children}
      </main>
    
    </section>
  );
}