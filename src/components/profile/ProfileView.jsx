// src/components/profile/ProfileView.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  School,
  Award,
  FileText,
  Link,
  Edit,
  Eye,
  Building,
  Globe,
  ExternalLink,
  Download,
  Star
} from 'lucide-react';

export default function ProfileView({ profile, isOwner = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { fetchProfile, profileId } = useStore(state => ({
    fetchProfile: state.fetchProfile,
    profileId: state.profileId
  }));

  // Ensure we have the latest profile data
  useEffect(() => {
    if (profileId && !profile) {
      setLoading(true);
      fetchProfile().finally(() => setLoading(false));
    }
  }, [profileId, profile, fetchProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Profile not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This profile doesn't exist or you don't have permission to view it.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-gray-200 dark:bg-gray-700';
      case 'intermediate': return 'bg-blue-200 dark:bg-blue-800';
      case 'advanced': return 'bg-green-200 dark:bg-green-800';
      case 'expert': return 'bg-purple-200 dark:bg-purple-800';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  const getLevelWidth = (level) => {
    switch (level) {
      case 'beginner': return '25%';
      case 'intermediate': return '50%';
      case 'advanced': return '75%';
      case 'expert': return '100%';
      default: return '50%';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover/Header Background */}
        <div className="h-32 bg-gradient-to-r from-[#0CCE68] to-[#0BBE58]"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={`${profile.user?.first_name} ${profile.user?.last_name}`}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {profile.profile_strength && (
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="flex items-center text-[#0CCE68] font-bold text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      {profile.profile_strength}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.user?.first_name} {profile.user?.last_name}
                  </h1>
                  {profile.job_title && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                      {profile.job_title}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {profile.user?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        <span>{profile.user.email}</span>
                      </div>
                    )}
                    {profile.user?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        <span>{profile.user.phone}</span>
                      </div>
                    )}
                    {profile.country && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profile.country}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isOwner && (
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={() => router.push('/dashboard/jobseeker/profile/edit')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Professional Summary */}
          {profile.bio && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Work Experience
            </h2>
            
            {profile.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-6">
                {profile.experiences.map((experience) => (
                  <div key={experience.id} className="border-l-4 border-[#0CCE68] pl-6 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {experience.job_title}
                    </h3>
                    <div className="mt-1 flex items-center text-gray-600 dark:text-gray-300">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{experience.company_name}</span>
                    </div>
                    {experience.location && (
                      <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                    <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(experience.start_date)} - 
                        {experience.current_job ? ' Present' : ` ${formatDate(experience.end_date)}`}
                      </span>
                    </div>
                    {experience.description && (
                      <p className="mt-3 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {experience.description}
                      </p>
                    )}
                    {experience.portfolio_link && (
                      <div className="mt-3">
                        <a
                          href={experience.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Project
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No work experience added yet</p>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Education
            </h2>
            
            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-[#0CCE68] pl-6 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {edu.degree_display || edu.degree} in {edu.field_of_study}
                    </h3>
                    <div className="mt-1 flex items-center text-gray-600 dark:text-gray-300">
                      <School className="h-4 w-4 mr-2" />
                      <span>{edu.institution}</span>
                    </div>
                    <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(edu.start_date)} - 
                        {edu.current ? ' Present' : ` ${formatDate(edu.end_date)}`}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="mt-3 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <School className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No education history added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Profile Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Stats
            </h3>
            <div className="space-y-4">
              {profile.profile_strength && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Profile Strength</span>
                    <span className="text-[#0CCE68] font-medium">{profile.profile_strength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#0CCE68] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile.profile_strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {profile.years_experience > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Experience</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {profile.years_experience} years
                  </span>
                </div>
              )}
              
              {(profile.salary_min || profile.salary_max) && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block text-sm">Salary Range</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {profile.salary_min && profile.salary_max
                      ? `$${profile.salary_min} - $${profile.salary_max} ${profile.salary_currency || 'USD'}`
                      : profile.salary_min
                      ? `From $${profile.salary_min} ${profile.salary_currency || 'USD'}`
                      : `Up to $${profile.salary_max} ${profile.salary_currency || 'USD'}`
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </h3>
            
            {profile.skills && profile.skills.length > 0 ? (
              <div className="space-y-4">
                {profile.skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.level_display || skill.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getLevelColor(skill.level)}`}
                        style={{ width: getLevelWidth(skill.level) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No skills added yet</p>
              </div>
            )}
          </div>

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Certifications
              </h3>
              <div className="space-y-4">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="border-l-2 border-[#0CCE68] pl-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {cert.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {cert.institution}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cert.year_awarded}
                    </p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-xs mt-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Items */}
          {profile.portfolio_items && profile.portfolio_items.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Portfolio
              </h3>
              <div className="space-y-4">
                {profile.portfolio_items.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-24 object-cover rounded mt-2"
                      />
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm mt-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}