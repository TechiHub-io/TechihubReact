// ProfilePage.tsx
'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Swrgetdat } from '@/libs/hooks/Swrgetdat';
import ProfileHeader from './(components)/ProfileHeader';
import BioSection from './(components)/BioSection';
import JobOverviewSection from './(components)/JobOverviewSection';
import ExperienceSection from './(components)/ExperienceSection';
import EducationSection from './(components)/EducationSection';
import ContactSection from './(components)/ContactSection';
import WebLinksSection from './(components)/WebLinksSection';
import BouncingCirclesLoader from '@/components/animations/BouncingCircleLoader';

const ProfilePage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/dashboard")
    }
  });

  // @ts-ignore
  const userId = session?.user?.userId;
  console.log(userId);
  const { data, isLoading, error } = Swrgetdat(`/api/user-profile/${userId}`);
  console.log("my data", data);
  if (isLoading) return <div><BouncingCirclesLoader /></div>;
  if (error) return <div>Error loading profile</div>;

  const userProfile = data?.userProfile;

  const decodeProfilePhotoUrl = (url: string) => {
    return url ? url.replace(/%2f/gi, '/') : '';
  };

  const calculateProfileCompletion = () => {
    const fields = [
      userProfile.first_name,
      userProfile.last_name,
      userProfile.address,
      userProfile.email,
      userProfile.role_name,
      userProfile.phone_number,
      userProfile.profile_photo_url,
      userProfile.githubUrl,
      userProfile.linkedinUrl,
      userProfile.about
    ];
    const filledFields = fields.filter(field => field).length;
    const hasEducation = userProfile.educations.length > 0;
    const hasExperience = userProfile.experiences.length > 0;
    return Math.round(((filledFields + (hasEducation ? 1 : 0) + (hasExperience ? 1 : 0)) / (fields.length + 2)) * 100);
  };
  return (
    <main className='bg-[#f2f5fc] h-full'>
      <div className="container mx-auto xl:mx-0 px-4 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileHeader
              name={`${userProfile.first_name} ${userProfile.last_name}`}
              role={userProfile.role_name}
              profilePhotoUrl={decodeProfilePhotoUrl(userProfile.profile_photo_url)}
              completionPercentage={calculateProfileCompletion()}
            />
            <ContactSection
              phone={userProfile.phone_number}
              email={userProfile.email}
              linkedin={userProfile.linkedinUrl}
            />
            <WebLinksSection
              githubUrl={userProfile.githubUrl}
              linkedinUrl={userProfile.linkedinUrl}
            />
          </div>
          
          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <BioSection bio={userProfile.about} />
            <JobOverviewSection
              experience={userProfile.experiences.length}
              // jobLevel={userProfile.role_name}
              // salaryExpectation="$50k-80k/month"
              education={userProfile.educations[0]?.course || "Degree"}
            />
            <ExperienceSection experiences={userProfile.experiences} />
            <EducationSection educations={userProfile.educations} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;