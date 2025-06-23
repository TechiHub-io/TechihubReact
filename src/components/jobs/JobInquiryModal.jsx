// src/components/jobs/JobInquiryModal.jsx - Updated to use job details
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJobCommunication } from '@/hooks/useJobCommunication';
import { X, Mail, Briefcase, Building2, Send, Loader2, MapPin, Calendar, DollarSign } from 'lucide-react';

const MESSAGE_TEMPLATES = [
  {
    subject: "Question about job requirements",
    message: "Hello,\n\nI'm interested in the {jobTitle} position at {companyName}. Could you please provide more details about the specific requirements and qualifications needed for this role?\n\nThank you for your time."
  },
  {
    subject: "Inquiry about salary and benefits",
    message: "Hello,\n\nI would like to learn more about the compensation package and benefits for the {jobTitle} position. Could you share more details when convenient?\n\nBest regards"
  },
  {
    subject: "Question about remote work policy",
    message: "Hello,\n\nI'm very interested in the {jobTitle} position. Could you clarify your remote work policy and flexibility for this role?\n\nThank you"
  },
  {
    subject: "General inquiry about the position",
    message: "Hello,\n\nI'm interested in the {jobTitle} position at {companyName}. I'd love to learn more about this opportunity and discuss how my background might be a good fit.\n\nLooking forward to hearing from you."
  }
];

export default function JobInquiryModal({ job, jobDetails, isOpen, onClose }) {
  const router = useRouter();
  const { createJobInquiry, loading, error, clearError } = useJobCommunication();
  
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);

  // Use jobDetails for company info, fallback to job for basic info
  const companyName = jobDetails?.company?.name || job.company_name;
  const jobTitle = jobDetails?.title || job.title;

  // Initialize with first template
  React.useEffect(() => {
    if (isOpen && useTemplate) {
      const template = MESSAGE_TEMPLATES[selectedTemplate];
      setSubject(template.subject);
      setMessage(
        template.message
          .replace('{jobTitle}', jobTitle)
          .replace('{companyName}', companyName)
      );
    }
  }, [isOpen, selectedTemplate, useTemplate, jobTitle, companyName]);

  const handleTemplateChange = (templateIndex) => {
    setSelectedTemplate(templateIndex);
    if (useTemplate) {
      const template = MESSAGE_TEMPLATES[templateIndex];
      setSubject(template.subject);
      setMessage(
        template.message
          .replace('{jobTitle}', jobTitle)
          .replace('{companyName}', companyName)
      );
    }
  };

  const handleCustomMessage = () => {
    setUseTemplate(false);
    setSubject('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      return;
    }

    try {
      const conversation = await createJobInquiry({
        jobId: job.id,
        subject: subject.trim(),
        message: message.trim(),
        jobDetails: jobDetails // Pass the full job details
      });

      // Redirect to the conversation
      router.push(`/messages/${conversation.id}`);
      onClose();
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to send message:', error);
    }
  };

  const formatSalary = () => {
    if (!jobDetails?.is_salary_visible || (!jobDetails?.min_salary && !jobDetails?.max_salary)) {
      return null;
    }

    const currency = jobDetails.salary_currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    });

    if (jobDetails.min_salary && jobDetails.max_salary) {
      return `${formatter.format(jobDetails.min_salary)} - ${formatter.format(jobDetails.max_salary)}`;
    } else if (jobDetails.min_salary) {
      return `From ${formatter.format(jobDetails.min_salary)}`;
    } else if (jobDetails.max_salary) {
      return `Up to ${formatter.format(jobDetails.max_salary)}`;
    }
  };

  if (!isOpen) return null;

  const salaryDisplay = formatSalary();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-[#0CCE68] mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contact Employer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Job Info */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* Job Title and Company */}
              <div className="flex items-start space-x-3">
                <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{jobTitle}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 mr-1" />
                    {companyName}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {jobDetails?.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {jobDetails.location}
                    {jobDetails.is_remote && (
                      <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-xs">
                        Remote
                      </span>
                    )}
                  </div>
                )}
                
                {jobDetails?.job_type_display && (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {jobDetails.job_type_display}
                  </div>
                )}
                
                {salaryDisplay && (
                  <div className="flex items-center text-[#0CCE68] font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {salaryDisplay}
                  </div>
                )}
                
                {jobDetails?.application_deadline && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline: {new Date(jobDetails.application_deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Message Type
              </label>
              <div className="space-y-2">
                {MESSAGE_TEMPLATES.map((template, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="template"
                      checked={useTemplate && selectedTemplate === index}
                      onChange={() => {
                        setUseTemplate(true);
                        handleTemplateChange(index);
                      }}
                      className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {template.subject}
                    </span>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="template"
                    checked={!useTemplate}
                    onChange={handleCustomMessage}
                    className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Write custom message
                  </span>
                </label>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
                {error}
                <button
                  type="button"
                  onClick={clearError}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !subject.trim() || !message.trim()}
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}