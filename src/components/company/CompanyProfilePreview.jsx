// src/components/company/CompanyProfilePreview.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Clock,
  Building
} from 'lucide-react';

export default function CompanyProfilePreview({ company }) {
  if (!company) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-500 dark:text-gray-400">No company data available</p>
      </div>
    );
  }
  
  // Company size options for display
  const companySizes = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1000 employees',
    '1001-5000': '1001-5000 employees',
    '5001+': 'Over 5000 employees'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover image or blank placeholder */}
      <div className="relative h-32 bg-gradient-to-r from-[#0CCE68] to-[#364187]">
        {company.cover_image && (
          <Image
            src={company.cover_image}
            alt={`${company.name} cover`}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      
      {/* Company logo and basic info */}
      <div className="relative px-6 pb-6">
        <div className="absolute -top-16 left-6 w-24 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              width={96}
              height={96}
              objectFit="contain"
            />
          ) : (
            <Building className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          )}
        </div>
        
        <div className="mt-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {company.name}
          </h1>
          
          <div className="flex flex-wrap gap-3 mt-2">
            {company.industry && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {company.industry}
              </span>
            )}
            
            {company.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{company.location}</span>
              </div>
            )}
            
            {company.size && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span>{companySizes[company.size] || company.size}</span>
              </div>
            )}
            
            {company.founding_date && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Founded in {new Date(company.founding_date).getFullYear()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Company details */}
      <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          About
        </h2>
        
        <div className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
          {company.description || 'No company description provided.'}
        </div>
        
        {/* Contact information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {company.website && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Globe className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0CCE68] hover:underline"
              >
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {company.email && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
              <a 
                href={`mailto:${company.email}`}
                className="text-[#0CCE68] hover:underline"
              >
                {company.email}
              </a>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Phone className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
              <a 
                href={`tel:${company.phone}`}
                className="text-[#0CCE68] hover:underline"
              >
                {company.phone}
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Company benefits */}
      {company.benefits && company.benefits.length > 0 && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Benefits & Perks
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.benefits.map((benefit, index) => (
              <div key={benefit.id || index} className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-[#0CCE68] text-white">
                  {benefit.icon || '✓'}
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  {benefit.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Company images */}
      {company.images && company.images.length > 0 && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Company Images
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {company.images.map((image, index) => (
              <div 
                key={image.id || index} 
                className="relative h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
              >
                <Image
                  src={image.image}
                  alt={image.caption || `Company image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Team members preview */}
      {company.members && company.members.length > 0 && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Team
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {company.members.slice(0, 4).map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  {member.profile_picture ? (
                    <Image
                      src={member.profile_picture}
                      alt={member.name}
                      width={64}
                      height={64}
                      objectFit="cover"
                    />
                  ) : (
                    <Users className="w-full h-full p-4 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {member.role_display || member.role}
                </p>
              </div>
            ))}
          </div>
          
          {company.members.length > 4 && (
            <p className="text-sm text-center mt-3 text-gray-500 dark:text-gray-400">
              + {company.members.length - 4} more team members
            </p>
          )}
        </div>
      )}
      
      {/* Open positions */}
      {company.open_positions && company.open_positions.length > 0 && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Open Positions
          </h2>
          
          <div className="space-y-3">
            {company.open_positions.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <Link href={`/jobs/${job.id}`}>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white hover:text-[#0CCE68] cursor-pointer">
                    {job.title}
                  </h3>
                </Link>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.location && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  
                  {job.is_remote && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Remote
                    </span>
                  )}
                  
                  {job.application_deadline && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        Closes {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {company.open_positions.length > 3 && (
            <div className="mt-4 text-center">
              <Link 
                href={`/company/${company.id}`}
                className="text-[#0CCE68] hover:underline"
              >
                View all {company.open_positions.length} open positions
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}