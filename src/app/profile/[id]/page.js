'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useAuthAxios } from '@/hooks/useAuthAxios';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  ExternalLink,
  Download,
  MessageCircle,
  Heart,
  Users,
  Building,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function ProfileViewPage() {
  const router = useRouter();
  const params = useParams();
  const authAxios = useAuthAxios();
  const { isAuthenticated, isEmployer } = useStore();
  
  const [profile, setProfile] = useState(null);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [contactingCandidate, setContactingCandidate] = useState(false);

  // Helper function to get proper image URL
  const getProfileImageUrl = (profile) => {
    let imageUrl = profile?.profile_picture || profile?.social_avatar_url;
    
    if (!imageUrl) return null;
    
    // Fix Google profile image URLs
    if (imageUrl.includes('googleusercontent.com')) {
      imageUrl = imageUrl.split('=')[0] + '=s300-c';
    }
    
    return imageUrl;
  };

  // Check if profile is saved on load
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!authAxios || !profile || !isEmployer) return;
      
      try {
        const response = await authAxios.get(`saved-profiles/check/${profile.id}/`);
        setIsSaved(response.data.is_saved);
      } catch (err) {
        console.error('Failed to check saved status:', err);
      }
    };
    
    checkSavedStatus();
  }, [authAxios, profile, isEmployer]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authAxios || !params.id) return;

      setLoading(true);
      try {
        const response = await authAxios.get(`profiles/${params.id}/`);
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authAxios, params.id]);

  // Save/Unsave profile
  const handleSaveProfile = async () => {
    if (!authAxios || !profile) return;

    setSavingProfile(true);
    try {
      if (isSaved) {
        // Find and remove the saved profile
        const checkResponse = await authAxios.get(`saved-profiles/check/${profile.id}/`);
        if (checkResponse.data.saved_profile_id) {
          await authAxios.delete(`saved-profiles/${checkResponse.data.saved_profile_id}/`);
        }
        setIsSaved(false);
      } else {
        // Add to saved profiles
        await authAxios.post('saved-profiles/create/', { profile_id: profile.id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to save/unsave profile:', err);
      // Show error message to user
      alert(`Failed to ${isSaved ? 'unsave' : 'save'} profile: ${err.response?.data?.message || err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Contact candidate
  const handleContactCandidate = async () => {
    if (!authAxios || !profile) return;
    
    // Validate that we have the user ID
    const userId = profile.user?.id;
    if (!userId) {
      alert('Unable to contact this candidate - user information not available.');
      return;
    }

    setContactingCandidate(true);
    try {
      // Start a conversation with the candidate using correct API format
      const response = await authAxios.post('conversations/', {
        participant_ids: [userId], // Array of participant IDs
        subject: `Interest in your profile - ${profile.job_title || 'Professional Opportunity'}`,
        initial_message: `Hi ${profile.user_name || profile.user?.first_name || profile.user?.email || 'there'},\n\nI came across your profile and I'm interested in discussing potential opportunities with you.\n\nBest regards`,
        conversation_type: 'job_inquiry'
      });
      
      // Redirect to the conversation
      router.push(`/messages/${response.data.id}`);
    } catch (err) {
      console.error('Failed to contact candidate:', err);
      console.error('Error details:', err.response?.data);
      console.error('Request data:', {
        participant_ids: [userId],
        subject: `Interest in your profile - ${profile.job_title || 'Professional Opportunity'}`,
        conversation_type: 'job_inquiry'
      });
      
      // Show more specific error message
      let errorMessage = 'Failed to send message';
      if (err.response?.data?.participant_ids) {
        errorMessage = 'Invalid recipient - please try again';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      // Fallback: try to redirect to messages page
      router.push('/messages');
    } finally {
      setContactingCandidate(false);
    }
  };

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The profile you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'portfolio', label: 'Portfolio', icon: Globe }
  ];
   
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </button>
            
            {isEmployer && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  {savingProfile ? 'Saving...' : isSaved ? 'Saved' : 'Save Profile'}
                </button>
                <button
                  onClick={handleContactCandidate}
                  disabled={contactingCandidate}
                  className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] text-sm font-medium disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {contactingCandidate ? 'Contacting...' : 'Contact'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Profile Picture & Basic Info */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
                  {getProfileImageUrl(profile) ? (
                    <img 
                      src={getProfileImageUrl(profile)} 
                      alt={profile.user_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <Users className="w-16 h-16 text-gray-400" style={{display: getProfileImageUrl(profile) ? 'none' : 'block'}} />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.user.first_name || 'Anonymous User'}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {profile.job_title || 'Job Seeker'}
                </p>

                {/* Profile Strength */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Strength</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.profile_strength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#0CCE68] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile.profile_strength}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Info</h3>
                
                {profile.user_email && isEmployer && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="text-sm">{profile.user_email}</span>
                  </div>
                )}
                
                {profile.country && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="text-sm">{profile.country}</span>
                  </div>
                )}
                
                {profile.years_experience > 0 && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5 mr-3" />
                    <span className="text-sm">{profile.years_experience} years experience</span>
                  </div>
                )}

                {(profile.salary_min || profile.salary_max) && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-5 h-5 mr-3" />
                    <span className="text-sm">
                      {profile.salary_min && profile.salary_max 
                        ? `$${profile.salary_min.toLocaleString()} - $${profile.salary_max.toLocaleString()}`
                        : profile.salary_min 
                        ? `From $${profile.salary_min.toLocaleString()}`
                        : `Up to $${profile.salary_max.toLocaleString()}`
                      } {profile.salary_currency || 'USD'}
                    </span>
                  </div>
                )}
              </div>

              {/* Skills Preview */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#0CCE68]/10 text-[#0CCE68] text-sm rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {profile.skills.length > 6 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                        +{profile.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                          activeTab === tab.id
                            ? 'border-[#0CCE68] text-[#0CCE68]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {profile.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
                      </div>
                    )}

                    {/* Recent Experience */}
                    {profile.recent_experience && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Position</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#0CCE68]/10 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-[#0CCE68]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {profile.recent_experience.job_title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {profile.recent_experience.company_name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                {profile.recent_experience.current_job ? 'Current' : 
                                 `${new Date(profile.recent_experience.start_date).getFullYear()} - ${
                                   profile.recent_experience.end_date ? 
                                   new Date(profile.recent_experience.end_date).getFullYear() : 'Present'
                                 }`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Experience</h3>
                    {profile.experiences && profile.experiences.length > 0 ? (
                      <div className="space-y-4">
                        {profile.experiences.map((exp, index) => (
                          <div key={index} className="border-l-2 border-[#0CCE68] pl-4 pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{exp.job_title}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{exp.company_name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                  {new Date(exp.start_date).getFullYear()} - {
                                    exp.current_job ? 'Present' : 
                                    exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'
                                  }
                                </p>
                                {exp.description && (
                                  <p className="text-gray-600 dark:text-gray-300 mt-2">{exp.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No work experience listed.</p>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
                    {profile.education && profile.education.length > 0 ? (
                      <div className="space-y-4">
                        {profile.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-[#0CCE68] pl-4 pb-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {edu.degree} in {edu.field_of_study}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {new Date(edu.start_date).getFullYear()} - {
                                edu.current ? 'Present' : 
                                edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No education information listed.</p>
                    )}
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills & Expertise</h3>
                    {profile.skills && profile.skills.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.skills.map((skill, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{skill.name}</h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                {skill.level}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-[#0CCE68] h-2 rounded-full"
                                style={{ 
                                  width: skill.level === 'expert' ? '100%' : 
                                         skill.level === 'advanced' ? '80%' : 
                                         skill.level === 'intermediate' ? '60%' : '40%' 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No skills listed.</p>
                    )}
                  </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio</h3>
                    
                    {/* Portfolio URLs */}
                    {profile.portfolio_urls && profile.portfolio_urls.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Portfolio Links</h4>
                        <div className="space-y-2">
                          {profile.portfolio_urls.map((portfolio, index) => (
                            <a
                              key={index}
                              href={portfolio.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Globe className="w-5 h-5 text-[#0CCE68] mr-3" />
                              <span className="text-gray-900 dark:text-white">{portfolio.label}</span>
                              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Portfolio Items */}
                    {profile.portfolio_items && profile.portfolio_items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.portfolio_items.map((item, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                              />
                            )}
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{item.description}</p>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm"
                              >
                                View Project
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No portfolio items to display.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
