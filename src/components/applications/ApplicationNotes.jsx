// src/components/applications/ApplicationNotes.jsx 
import React, { useState, useEffect } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { useStore } from '@/hooks/useZustandStore';
import { formatDate } from '@/lib/utils/date';
import { 
  StickyNote, 
  Edit3, 
  Save, 
  X,
  AlertCircle
} from 'lucide-react';

export default function ApplicationNotes({ 
  applicationId, 
  currentApplication,
  onNotesUpdated,
  className = "" 
}) {
  const { updateApplicationStatus, loading, error } = useApplications();
  const { user } = useStore(state => ({ user: state.user }));
  
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [tempNotes, setTempNotes] = useState('');

  // Initialize notes from current application
  useEffect(() => {
    if (currentApplication?.employer_notes) {
      setNotes(currentApplication.employer_notes);
      setTempNotes(currentApplication.employer_notes);
    }
  }, [currentApplication?.employer_notes]);

  // Handle save notes
  const handleSaveNotes = async () => {
    if (!applicationId || !currentApplication) return;
  
    try {
      // Update via status endpoint with the correct format
      const updateData = {
        status: currentApplication.status, // Keep current status
        employer_notes: tempNotes.trim()
      };
      
      await updateApplicationStatus(applicationId, updateData);
      
      setNotes(tempNotes.trim());
      setIsEditing(false);
      
      // Notify parent component that notes were updated
      if (onNotesUpdated) {
        onNotesUpdated();
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
      // Error is already handled in the hook
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setTempNotes(notes);
    setIsEditing(false);
  };

  // Handle start editing
  const handleStartEdit = () => {
    setTempNotes(notes);
    setIsEditing(true);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <StickyNote className="w-5 h-5 mr-2" />
          Employer Notes
        </h3>
        
        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {notes ? 'Edit' : 'Add Notes'}
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveNotes}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Notes Content */}
      <div className="space-y-4">
        {isEditing ? (
          /* Edit Mode */
          <div>
            <textarea
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Add your notes about this applicant... These notes are internal and only visible to your team."
              rows={8}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-transparent resize-vertical"
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              These notes are private to your organization and won't be visible to the applicant.
            </div>
          </div>
        ) : (
          /* View Mode */
          <div>
            {notes ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-[#0CCE68]">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated: {currentApplication?.updated_at ? formatDate(currentApplication.updated_at, 'full') : 'Never'}
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                    {notes}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                <StickyNote className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notes yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Click "Add Notes" to record your thoughts about this applicant
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-xs text-blue-800 dark:text-blue-300">
          <strong>💡 Tip:</strong> Use notes to track your impressions, interview feedback, reference checks, 
          or any other relevant information about the candidate. These notes are only visible to your team.
        </div>
      </div>
    </div>
  );
}