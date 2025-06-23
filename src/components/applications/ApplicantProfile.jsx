// src/components/applications/ApplicantProfile.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Globe,
  Download,
  FileText
} from 'lucide-react';

export default function ApplicantProfile({ applicant, showActions = true }) {
  if (!applicant) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Applicant information not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start">
        {/* Profile picture */}
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
            {applicant.profile_picture ? (
              <Image
                src={applicant.profile_picture}
                alt={applicant.name || 'Applicant'}
                width={80}
                height={80}
                objectFit="cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
        
        {/* Basic info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {applicant.name || 'Anonymous Applicant'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {applicant.job_title || 'No title provided'}
              </p>
            </div>
            
            {showActions && applicant.profile_id && (
              <Link 
                href={`/profile/${applicant.profile_id}`}
                className="mt-2 sm:mt-0 inline-flex items-center text-[#0CCE68] hover:underline"
              >
                <User className="w-4 h-4 mr-1" />
                View Full Profile
              </Link>
            )}
          </div>
          
          {/* Contact details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {applicant.email && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <a 
                  href={`mailto:${applicant.email}`} 
                  className="hover:text-[#0CCE68] hover:underline"
                >
                  {applicant.email}
                </a>
              </div>
            )}
            
            {applicant.phone && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <a 
                  href={`tel:${applicant.phone}`}
                  className="hover:text-[#0CCE68] hover:underline"
                >
                  {applicant.phone}
                </a>
              </div>
            )}
            
            {applicant.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <span>{applicant.location}</span>
              </div>
            )}
            
            {applicant.website && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <a 
                  href={applicant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#0CCE68] hover:underline"
                >
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Resumé section */}
      {applicant.resume && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resume
            </h3>
            
            <a
              href={applicant.resume}
              download
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </a>
          </div>
          
          <div className="mt-3 flex items-center text-gray-600 dark:text-gray-400">
            <FileText className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
            <span>Resume file attached</span>
          </div>
        </div>
      )}
      
      {/* Skills section */}
      {applicant.skills && applicant.skills.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Skills
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {applicant.skills.map((skill, index) => (
              <span 
                key={skill.id || index} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm"
              >
                {skill.name}
                {skill.level && (
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({skill.level_display || skill.level})
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Experience section */}
      {applicant.experience && applicant.experience.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Experience
          </h3>
          
          <div className="space-y-4">
            {applicant.experience.map((exp, index) => (
              <div key={exp.id || index} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  {exp.job_title} at {exp.company_name}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(exp.start_date).toLocaleDateString()} - 
                  {exp.current_job ? ' Present' : ` ${new Date(exp.end_date).toLocaleDateString()}`}
                </p>
                
                {exp.description && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education section */}
      {applicant.education && applicant.education.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Education
          </h3>
          
          <div className="space-y-4">
            {applicant.education.map((edu, index) => (
              <div key={edu.id || index} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  {edu.degree_display || edu.degree} in {edu.field_of_study}
                </h4>
                
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {edu.institution}
                </p>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(edu.start_date).toLocaleDateString()} - 
                  {edu.current ? ' Present' : ` ${new Date(edu.end_date).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Portfolio items */}
      {applicant.portfolio_items && applicant.portfolio_items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Portfolio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applicant.portfolio_items.map((item, index) => (
              <div key={item.id || index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                
                {item.description && (
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {item.description}
                  </p>
                )}
                
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-[#0CCE68] hover:underline text-sm"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}