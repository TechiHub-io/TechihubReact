// src/components/company/CompanyProfile.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCompany } from '@/hooks/useCompany';
import { useNotification } from '@/hooks/useNotification';
import CompanyDetailsSection from './profile/CompanyDetailsSection';
import CompanyBenefitsSection from './profile/CompanyBenefitsSection';
import CompanyGallerySection from './profile/CompanyGallerySection';
import CompanyTeamSection from './profile/CompanyTeamSection';
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Mail, 
  Phone, 
  Edit,
} from 'lucide-react';

export default function CompanyProfile({ company, isOwner, companyId }) {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  // Handle edit profile click
  const handleEditProfile = () => {
    router.push(`/company/${companyId}/edit`);
  };
  
  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Company information not available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header with company basics and edit button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Company logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {company.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              ) : (
                <Building className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              )}
            </div>
          </div>
          
          {/* Company info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {company.name}
                </h1>
                
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  {company.industry && (
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      <span>{company.industry}</span>
                    </div>
                  )}
                  
                  {company.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  
                  {company.size && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{company.size} employees</span>
                    </div>
                  )}
                  
                  {company.founding_date && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Founded {new Date(company.founding_date).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {  (
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center px-2 py-1 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit 
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Contact information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {company.website && (
            <a 
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68]"
            >
              <Globe className="w-4 h-4 mr-2" />
              <span className="truncate">{company.website}</span>
            </a>
          )}
          
          {company.email && (
            <a 
              href={`mailto:${company.email}`}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68]"
            >
              <Mail className="w-4 h-4 mr-2" />
              <span className="truncate">{company.email}</span>
            </a>
          )}
          
          {company.phone && (
            <a 
              href={`tel:${company.phone}`}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#0CCE68] dark:hover:text-[#0CCE68]"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>{company.phone}</span>
            </a>
          )}
        </div>
        
        {/* Social media links */}
        {(company.linkedin || company.twitter || company.facebook || company.instagram) && (
          <div className="mt-6 flex flex-wrap gap-4">
            {company.linkedin && (
              <a 
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                </svg>
              </a>
            )}
            
            {company.twitter && (
              <a 
                href={company.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            )}
            
            {company.facebook && (
              <a 
                href={company.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            
            {company.instagram && (
              <a 
                href={company.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Company Sections */}
      <CompanyDetailsSection 
        company={company} 
        isOwner={isOwner} 
        companyId={companyId} 
      />
      
      <CompanyBenefitsSection 
        isOwner={isOwner} 
        companyId={companyId} 
      />
      
      <CompanyGallerySection 
        isOwner={isOwner} 
        companyId={companyId} 
      />
      
      {/* <CompanyTeamSection 
        company={company} 
        isOwner={isOwner} 
        companyId={companyId} 
      /> */}
    </div>
  );
}