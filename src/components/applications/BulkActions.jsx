// src/components/applications/BulkActions.jsx
import React, { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { useApplicationStages } from '@/hooks/useApplicationStages';
import { 
  CheckSquare, 
  Square, 
  ChevronDown, 
  Mail, 
  UserCheck, 
  UserX, 
  MessageSquare,
  Download,
  Archive,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function BulkActions({ 
  applications = [], 
  selectedApplications = [], 
  onSelectionChange,
  onBulkActionComplete,
  className = "" 
}) {
  const { updateApplicationStatus, loading } = useApplications();
  const { stages } = useApplicationStages();
  
  const [showActions, setShowActions] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Check if all visible applications are selected
  const allSelected = applications.length > 0 && applications.every(app => 
    selectedApplications.includes(app.id)
  );

  // Check if some applications are selected
  const someSelected = selectedApplications.length > 0 && !allSelected;

  // Handle select all toggle
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(applications.map(app => app.id));
    }
  };

  // Handle individual selection
  const handleSelectApplication = (applicationId) => {
    if (selectedApplications.includes(applicationId)) {
      onSelectionChange(selectedApplications.filter(id => id !== applicationId));
    } else {
      onSelectionChange([...selectedApplications, applicationId]);
    }
  };

  // Bulk status update
  const handleBulkStatusUpdate = async (status, stageId = null) => {
    if (selectedApplications.length === 0) return;

    setConfirmAction(null);
    
    try {
      const updatePromises = selectedApplications.map(applicationId => {
        const updateData = { status };
        if (stageId) updateData.stage_id = stageId;
        return updateApplicationStatus(applicationId, updateData);
      });
      
      await Promise.all(updatePromises);
      
      onSelectionChange([]);
      if (onBulkActionComplete) {
        onBulkActionComplete('status_update', selectedApplications.length);
      }
    } catch (error) {
      console.error('Bulk status update failed:', error);
    }
  };

  // Bulk export
  const handleBulkExport = () => {
    if (selectedApplications.length === 0) return;

    // Create CSV data
    const selectedApps = applications.filter(app => selectedApplications.includes(app.id));
    const csvData = selectedApps.map(app => ({
      'Applicant Name': app.applicant?.name || '',
      'Email': app.applicant?.email || '',
      'Job Title': app.job?.title || '',
      'Status': app.status,
      'Applied Date': new Date(app.created_at).toLocaleDateString(),
      'Experience': app.applicant?.experience_years || '',
      'Location': app.applicant?.location || ''
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    if (onBulkActionComplete) {
      onBulkActionComplete('export', selectedApplications.length);
    }
  };

  // Action options
  const bulkActions = [
    {
      id: 'approve_screening',
      label: 'Move to Screening',
      icon: UserCheck,
      action: () => handleBulkStatusUpdate('screening'),
      color: 'text-blue-600'
    },
    {
      id: 'schedule_interview',
      label: 'Move to Interview',
      icon: MessageSquare,
      action: () => handleBulkStatusUpdate('interview'),
      color: 'text-purple-600'
    },
    {
      id: 'reject',
      label: 'Reject Applications',
      icon: UserX,
      action: () => setConfirmAction('reject'),
      color: 'text-red-600',
      dangerous: true
    },
    {
      id: 'export',
      label: 'Export to CSV',
      icon: Download,
      action: handleBulkExport,
      color: 'text-gray-600'
    }
  ];

  if (selectedApplications.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5" />
              ) : someSelected ? (
                <div className="w-5 h-5 bg-[#0CCE68] rounded border-2 border-[#0CCE68] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className="text-sm">Select All ({applications.length})</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {applications.length} applications
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-[#0CCE68]" />
              ) : (
                <div className="w-5 h-5 bg-[#0CCE68] rounded border-2 border-[#0CCE68] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
              )}
              <span className="text-sm">
                {selectedApplications.length} selected
              </span>
            </button>
            
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear selection
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm"
              >
                Bulk Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    {bulkActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => {
                          setShowActions(false);
                          action.action();
                        }}
                        disabled={loading}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors ${
                          action.dangerous ? 'text-red-600 dark:text-red-400' : action.color
                        } disabled:opacity-50`}
                      >
                        <action.icon className="w-4 h-4 mr-3" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Rows with Selection */}
      <div className="space-y-2">
        {applications.map(application => (
          <div
            key={application.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
              selectedApplications.includes(application.id)
                ? 'border-[#0CCE68] bg-[#0CCE68]/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <button
              onClick={() => handleSelectApplication(application.id)}
              className="flex-shrink-0"
            >
              {selectedApplications.includes(application.id) ? (
                <CheckSquare className="w-5 h-5 text-[#0CCE68]" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.applicant?.name || 'Unknown Applicant'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {application.job?.title} • {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.status === 'hired' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  }`}>
                    {application.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirm Bulk Rejection
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to reject {selectedApplications.length} applications? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject Applications
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}