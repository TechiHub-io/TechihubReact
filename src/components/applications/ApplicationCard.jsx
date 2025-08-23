// src/components/applications/ApplicationCard.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import QuickMessageComposer from './QuickMessageComposer';
import { 
  Building2,
  Calendar,
  MapPin,
  Eye,
  Download,
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink,
  RefreshCw,
  MessageCircle
} from 'lucide-react';

export default function ApplicationCard({ application, onWithdraw, onRefresh }) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [showRetry, setShowRetry] = useState(false);

  // Enhanced withdraw handler
  const handleWithdraw = async () => {
    if (withdrawing) {
      return;
    }

    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    setWithdrawing(true);
    setWithdrawMessage('');
    setShowRetry(false);

    try {
      const result = await onWithdraw(application.id);
      
      
      if (result?.success) {
        setWithdrawMessage(result.message || 'Application withdrawn successfully');
        setShowRetry(false);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setWithdrawMessage('');
        }, 5000);
      } else {
        setWithdrawMessage(result?.message || 'Failed to withdraw application');
        
        // Show retry option for certain types of errors
        if (result?.message?.includes('Server error') || result?.message?.includes('timeout')) {
          setShowRetry(true);
        }
        
        // Clear error message after 10 seconds
        setTimeout(() => {
          setWithdrawMessage('');
          setShowRetry(false);
        }, 10000);
      }
    } catch (error) {
      console.error('Withdraw handler error:', error);
      setWithdrawMessage('An unexpected error occurred. Please try again.');
      setShowRetry(true);
      
      // Clear error message after 10 seconds
      setTimeout(() => {
        setWithdrawMessage('');
        setShowRetry(false);
      }, 10000);
    } finally {
      setWithdrawing(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      setWithdrawMessage('Refreshing...');
      try {
        await onRefresh();
        setWithdrawMessage('');
      } catch (error) {
        setWithdrawMessage('Failed to refresh. Please reload the page.');
      }
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
  };

  // Get status styling
  const getStatusStyling = (status) => {
    const styles = {
      applied: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-800 dark:text-blue-300',
        icon: Clock
      },
      screening: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: Eye
      },
      interview: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        text: 'text-purple-800 dark:text-purple-300',
        icon: FileText
      },
      assessment: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        text: 'text-orange-800 dark:text-orange-300',
        icon: FileText
      },
      offer: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-300',
        icon: CheckCircle
      },
      hired: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-300',
        icon: CheckCircle
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-800 dark:text-red-300',
        icon: XCircle
      },
      withdrawn: {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-800 dark:text-gray-300',
        icon: XCircle
      }
    };
    
    return styles[status] || styles.applied;
  };

  const statusStyle = getStatusStyling(application.status);
  const StatusIcon = statusStyle.icon;

  // Format salary if available
  const formatSalary = () => {
    if (!application.expected_salary) return null;
    
    const currency = application.expected_salary_currency || 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(application.expected_salary);
  };

  const expectedSalary = formatSalary();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      {/* Withdraw Status Message */}
      {withdrawMessage && (
        <div className={`mb-4 p-3 rounded-md border ${
          withdrawMessage.includes('success') || withdrawMessage.includes('withdrawn')
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900/30'
            : withdrawMessage.includes('Refreshing')
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/30'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-sm">{withdrawMessage}</p>
            {showRetry && (
              <button
                onClick={handleRefresh}
                className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          {/* Job Title and Company */}
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {application.job?.title || 'Job Title Not Available'}
              </h3>
              
              <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
                <Building2 className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {application.job?.company_name || 'Company Not Available'}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <span 
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text} flex-shrink-0 ml-4`}
            >
              <StatusIcon className="w-4 h-4 mr-1" />
              {application.status_display || application.status}
            </span>
          </div>

          {/* Application Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Applied {formatDate(application.created_at, 'short')}</span>
            </div>
            
            {application.job?.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{application.job.location}</span>
              </div>
            )}
            
            {expectedSalary && (
              <div className="flex items-center text-[#0CCE68]">
                <span>Expected: {expectedSalary}</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {application.portfolio_url && (
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-1" />
                <a 
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0CCE68] hover:text-[#0BBE58]"
                >
                  Portfolio
                </a>
              </div>
            )}
            
            {application.available_start_date && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Available: {formatDate(application.available_start_date, 'short')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Letter Preview */}
      {application.cover_letter && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {application.cover_letter}
          </p>
        </div>
      )}

      {/* Employer Notes */}
      {application.employer_notes && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-start">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Employer Notes:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {application.employer_notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        {/* View Job */}
        {application.job?.id && (
          <Link 
            href={`/jobs/${application.job.id}`}
            className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Job
          </Link>
        )}

        {/* Download Resume */}
        {application.resume && (
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#0CCE68] hover:text-[#0BBE58] text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Resume
          </a>
        )}

        {/* View Details */}
     

        {/* Enhanced Withdraw Button */}
        {application.status !== 'withdrawn' && application.status !== 'hired' && application.status !== 'rejected' && (
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {withdrawing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                Withdrawing...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-1" />
                Withdraw
              </>
            )}
          </button>
        )}
      </div>

      {/* Quick Message Composer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <QuickMessageComposer application={application} />
      </div>
    </div>
  );
}