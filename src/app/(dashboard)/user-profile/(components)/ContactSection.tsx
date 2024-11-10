import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileDialog from '@/(components)/homepage/EditProfileDialogProps';
import { Button } from '@/components/ui/button';

interface UserProfile {
  // Add the actual properties of your user profile
  id?: string;
  first_name: any;
  last_name: any;
  address: any;
  email: any;
  role_name: any;
  phone_number: any;
  githubUrl: any;
  linkedinUrl: any;
  about: any;
}


interface ContactSectionProps {
  phone: string;
  email: string;
  linkedin: string;
  userProfile: UserProfile;
}

const ContactSection: React.FC<ContactSectionProps> = ({ phone, email, userProfile, linkedin }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n-1) + "..." : str;
  };

  return (
    <Card className="mb-6 bg-white shadow-sm rounded-lg lg:max-w-[379px]">
      <CardHeader className="pb-3 ">
        <CardTitle className="text-xl font-semibold text-[#18191C]">Contact</CardTitle>
        
      </CardHeader>
      <CardContent >
        <div className='flex justify-between'>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#18191C]">{truncate(phone, 5)}</p>
            </div>
            <button onClick={() => copyToClipboard(phone, 'phone')} className="p-1 bg-[#D8F7E7] text-[#0CCE68] rounded">
              {copied === 'phone' ? '✓' : 
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#0CCE68]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#18191C]">{truncate(email, 7)}</p>
            </div>
            <button onClick={() => copyToClipboard(email, 'email')} className="p-1 bg-[#D8F7E7] text-[#0CCE68] rounded">
              {copied === 'email' ? '✓' : 
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            </button>
          </div>
        </div>
        
        <hr className='my-4' />

        <div className="flex items-center pt-2">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#0A0A0A" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0A0A0A] hover:underline">
            LinkedIn
          </a>
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="#364187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 3h6v6" stroke="#364187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14L21 3" stroke="#364187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <EditProfileDialog
            userProfile={userProfile}
            trigger={
              <Button variant="ghost" size="sm" className="flex items-center w-full justify-center bg-[#31ac54] text-[#fff] mt-2 hover:bg-[#31ac54be] hover:text-[#fff]">
                Edit
              </Button>
            }
          />
      </CardContent>
    </Card>
  );
};

export default ContactSection;