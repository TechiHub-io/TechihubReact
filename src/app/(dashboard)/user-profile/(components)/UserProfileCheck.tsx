// components/UserProfileCheck.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import BouncingCirclesLoader from '@/components/animations/BouncingCircleLoader';

interface UserProfileCheckProps {
  children: React.ReactNode;
}

const UserProfileCheck: React.FC<UserProfileCheckProps> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin?callbackUrl=/dashboard");
    }
  });

  // @ts-ignore
  const userId = session?.user?.userId;
  const { data, isLoading, error } = Swrgetdat(`/api/user-profile/${userId}`);
  console.log("data", data)
  useEffect(() => {
    if (!isLoading && !error) {
      if (!data || !data.userProfile) {
        router.push('/settings');
      }else{
        router.push('/user-profile');
      }
    }
  }, [data, isLoading, error, router]);

  if (isLoading) return <div><BouncingCirclesLoader /></div>;
  if (error) return <div>Error loading profile</div>;
  if (!data || !data.userProfile) return null;

  return <>{children}</>;
};

export default UserProfileCheck;
