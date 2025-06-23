// src/components/applications/ApplicationStatusUpdate.jsx 
import React, { useState, useEffect } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { useApplicationStages } from '@/hooks/useApplicationStages';
import { 
  Save, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

export default function ApplicationStatusUpdate({ 
  applicationId, 
  currentStatus, 
  currentStageId = null,
  onStatusUpdated 
}) {
  const { updateApplicationStatus, loading, error } = useApplications();
  const { stages, getStageByStatus } = useApplicationStages();
  
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [selectedStageId, setSelectedStageId] = useState(currentStageId);
  const [notes, setNotes] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Status options with stages integration
  const statusOptions = [
    { value: 'applied', label: 'Applied', icon: Clock, color: 'text-blue-600' },
    { value: 'screening', label: 'Screening', icon: MessageSquare, color: 'text-yellow-600' },
    { value: 'interview', label: 'Interview', icon: MessageSquare, color: 'text-purple-600' },
    { value: 'offer', label: 'Offer Extended', icon: CheckCircle2, color: 'text-orange-600' },
    { value: 'hired', label: 'Hired', icon: CheckCircle2, color: 'text-green-600' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' }
  ];

  // Helper function to get stage by ID or status
  const getStageInfo = (stageId) => {
    if (!stageId) return null;
    // First try to find by ID
    const stageById = stages.find(stage => stage.id === stageId);
    if (stageById) return stageById;
    
    // If not found by ID, try by status
    return getStageByStatus(stageId);
  };

  // Get current stage info
  const currentStage = getStageInfo(selectedStageId);

  useEffect(() => {
    setSelectedStatus(currentStatus);
    setSelectedStageId(currentStageId);
  }, [currentStatus, currentStageId]);

  const handleStatusUpdate = async (newStatus = selectedStatus) => {
    if (newStatus === currentStatus && selectedStageId === currentStageId && !notes.trim() && !statusNote.trim()) return;
    
    try {
      // Prepare update data - only include non-empty fields
      const updateData = {
        status: newStatus
      };

      // Only add stage_id if it has a value
      if (selectedStageId) {
        updateData.stage_id = selectedStageId;
      }

      // Combine notes and status notes
      const combinedNotes = (notes.trim() || statusNote.trim());
      
      // Only add notes fields if there's actual content
      if (combinedNotes) {
        updateData.notes = combinedNotes;
        updateData.employer_notes = combinedNotes;
      }
      
      await updateApplicationStatus(applicationId, updateData);
      
      if (onStatusUpdated) {
        onStatusUpdated();
      }
      
      // Reset form
      setNotes('');
      setStatusNote('');
    } catch (err) {
      console.error('Failed to update application status:', err);
    }
  };

  const handleQuickStatusUpdate = async (status) => {
    try {
      // Only send the status field for quick updates
      await updateApplicationStatus(applicationId, { status });
      
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (err) {
      console.error('Failed to quick update status:', err);
    }
  };

  const getStatusIcon = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return Clock;
    return option.icon;
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'text-gray-600';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  };

  const hasChanges = selectedStatus !== currentStatus || 
                    selectedStageId !== currentStageId || 
                    notes.trim().length > 0 ||
                    statusNote.trim().length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Update Application Status
      </h3>

      {/* Current Status Display */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
        <div className="flex items-center space-x-2">
          {React.createElement(getStatusIcon(currentStatus), {
            className: `w-4 h-4 ${getStatusColor(currentStatus)}`
          })}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Current: {getStatusLabel(currentStatus)}
          </span>
        </div>
        {currentStage && (
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Stage: {currentStage.name}
          </div>
        )}
      </div>

      {/* Status Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          New Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stage Selection (if stages are available) */}
      {stages.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hiring Stage
          </label>
          <select
            value={selectedStageId || ''}
            onChange={(e) => setSelectedStageId(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
          >
            <option value="">Select a stage (optional)</option>
            {stages.filter(stage => stage.is_active).map(stage => (
              <option key={stage.id || stage.name} value={stage.id || stage.name}>
                {stage.name} {stage.description && `- ${stage.description}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Status Note for status change */}
      {selectedStatus !== currentStatus && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add a note about this status change (optional)
          </label>
          <textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Explain the reason for this status change..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] resize-none"
          />
        </div>
      )}

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center text-sm text-[#0CCE68] hover:text-[#0BBE58] mb-3 transition-colors"
      >
        <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        Advanced Options
      </button>

      {/* Notes (Advanced) */}
      {showAdvanced && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Internal Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes about this application..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] resize-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            These notes are internal and only visible to your team
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Preview Changes */}
      {hasChanges && !loading && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-md">
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Preview changes:</p>
            <ul className="text-xs space-y-1">
              {selectedStatus !== currentStatus && (
                <li>• Status: {getStatusLabel(currentStatus)} → {getStatusLabel(selectedStatus)}</li>
              )}
              {selectedStageId !== currentStageId && (
                <li>• Stage: {getStageInfo(currentStageId)?.name || 'None'} → {getStageInfo(selectedStageId)?.name || 'None'}</li>
              )}
              {(notes.trim() || statusNote.trim()) && (
                <li>• Adding notes</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Update Button */}
      <button
        onClick={() => handleStatusUpdate()}
        disabled={!hasChanges || loading}
        className="w-full flex items-center justify-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {loading ? 'Updating...' : 'Update Status'}
      </button>

      {/* Quick Status Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleQuickStatusUpdate('interview')}
          disabled={loading || currentStatus === 'interview'}
          className="px-3 py-2 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/30 disabled:opacity-50 transition-colors"
        >
          Move to Interview
        </button>
        <button
          onClick={() => handleQuickStatusUpdate('hired')}
          disabled={loading || currentStatus === 'hired'}
          className="px-3 py-2 text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/30 disabled:opacity-50 transition-colors"
        >
          Mark as Hired
        </button>
      </div>
    </div>
  );
}