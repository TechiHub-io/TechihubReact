// src/components/applications/ApplicationForm.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobSeeker } from '@/hooks/useJobSeeker';
import { 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ApplicationForm({ jobId }) {
  const router = useRouter();
  const { submitApplication, loading, error } = useJobSeeker();
  const { jobs } = useJobSearch();
  
  // Find job details
  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    resume: null,
    cover_letter: '',
    answers: {}
  });
  
  // Resume file name for display
  const [resumeFileName, setResumeFileName] = useState('');
  
  // Load job details and questions
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        const [jobResponse, questionsResponse] = await Promise.all([
          fetch(`${API_URL}/jobs/${jobId}/`),
          fetch(`${API_URL}/applications/questions/${jobId}/`)
        ]);
        
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJob(jobData);
        }
        
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resume: file });
      setResumeFileName(file.name);
    }
  };
  
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle question answer changes
  const handleAnswerChange = (questionId, value) => {
    setFormData({
      ...formData,
      answers: {
        ...formData.answers,
        [questionId]: value
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await submitApplication(jobId, formData);
      setFormSubmitted(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/dashboard/jobseeker/applications');
      }, 3000);
    } catch (err) {
      console.error('Application submission error:', err);
    }
  };
  
  // Show success message after submission
  if (formSubmitted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Application Submitted!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your application for {job?.title} at {job?.company_name} has been submitted successfully.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          You will be redirected to your applications page...
        </p>
      </div>
    );
  }
  
  // Show loading state while fetching job details
  if (!job) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Apply for {job.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          at {job.company_name}
        </p>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resume Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Resume/CV <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              <div className="space-y-1 text-center">
                {resumeFileName ? (
                  <div className="flex flex-col items-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resumeFileName}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload your resume in PDF, DOC, or DOCX format
                    </p>
                  </div>
                )}
                
                <div className="flex text-sm">
                  <label
                    htmlFor="resume-upload"
                    className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-[#0CCE68] hover:text-[#0BBE58] focus-within:outline-none"
                  >
                    <span>
                      {resumeFileName ? 'Replace file' : 'Upload a file'}
                    </span>
                    <input
                      id="resume-upload"
                      name="resume-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max 1MB
                </p>
              </div>
            </div>
          </div>
          
          {/* Cover Letter */}
          <div className="space-y-2">
            <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover Letter
            </label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              rows={6}
              className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              placeholder="Tell us why you're a great fit for this position..."
            ></textarea>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Optional but recommended. Explain why you're interested in this position and what makes you a strong candidate.
            </p>
          </div>
          
          {/* Application Questions */}
          {questions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Additional Questions
              </h2>
              
              {questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label htmlFor={`question-${question.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {question.question}
                    {question.is_required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {question.question_type === 'textarea' ? (
                    <textarea
                      id={`question-${question.id}`}
                      value={formData.answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      rows={4}
                      className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      required={question.is_required}
                    ></textarea>
                  ) : question.question_type === 'select' ? (
                    <select
                      id={`question-${question.id}`}
                      value={formData.answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] sm:text-sm rounded-md"
                      required={question.is_required}
                    >
                      <option value="">Select an option</option>
                      {question.options_list?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id={`question-${question.id}`}
                      value={formData.answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      required={question.is_required}
                    />
                  )}
                  
                  {question.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {question.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Clock className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Job summary card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Job Summary
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Type
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {job.job_type_display || job.job_type || 'Not specified'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {job.location || 'Not specified'}
                {job.is_remote && ' (Remote available)'}
              </p>
            </div>
          </div>
          
          {(job.min_salary || job.max_salary) && job.is_salary_visible && (
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salary Range
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {job.min_salary && job.max_salary 
                    ? `${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()} ${job.salary_currency || 'USD'}/year`
                    : job.min_salary 
                      ? `From ${job.min_salary.toLocaleString()} ${job.salary_currency || 'USD'}/year`
                      : `Up to ${job.max_salary.toLocaleString()} ${job.salary_currency || 'USD'}/year`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}