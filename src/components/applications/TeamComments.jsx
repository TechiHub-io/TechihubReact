// src/components/applications/TeamComments.jsx
import React, { useState, useEffect } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { useStore } from '@/hooks/useZustandStore';
import { formatDate } from '@/lib/utils/date';
import { 
  MessageSquare, 
  Plus, 
  User,
  Edit3,
  Save,
  X
} from 'lucide-react';

export default function TeamComments({ applicationId, application, onNotesUpdate, className = "" }) {
  const { updateApplicationStatus, loading, error } = useApplications();
  const { user } = useStore(state => ({ user: state.user }));
  
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(application?.employer_notes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  // Update notes when application prop changes
  useEffect(() => {
    setNotes(application?.employer_notes || '');
  }, [application?.employer_notes]);

  // Handle add new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;

    try {
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const userIdentifier = user?.first_name || user?.email || 'Team Member';
      const noteEntry = `[${timestamp}] ${userIdentifier}: ${newNote.trim()}`;
      
      const updatedNotes = notes ? `${notes}\n\n${noteEntry}` : noteEntry;
      
      await updateApplicationStatus(applicationId, {
        employer_notes: updatedNotes
      });
      
      setNotes(updatedNotes);
      setNewNote('');
      setShowAddNote(false);
      
      if (onNotesUpdate) {
        onNotesUpdate(updatedNotes);
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  // Handle edit existing notes
  const handleEditNotes = async () => {
    try {
      await updateApplicationStatus(applicationId, {
        employer_notes: editedNotes
      });
      
      setNotes(editedNotes);
      setIsEditing(false);
      
      if (onNotesUpdate) {
        onNotesUpdate(editedNotes);
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const startEditing = () => {
    setEditedNotes(notes);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedNotes('');
    setIsEditing(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Team Notes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Collaborative notes about this candidate
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {notes && !isEditing && (
            <button
              onClick={startEditing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
          
          <button
            onClick={() => setShowAddNote(!showAddNote)}
            className="inline-flex items-center px-3 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </button>
        </div>
      </div>

      {/* Current Notes Display */}
      {notes && !isEditing && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Notes:</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {notes}
          </div>
        </div>
      )}

      {/* Edit Notes Form */}
      {isEditing && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Edit Notes:</h4>
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] mb-3"
          />
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEditNotes}
              disabled={loading}
              className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
            >
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={cancelEditing}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Note Form */}
      {showAddNote && (
        <form onSubmit={handleAddNote} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Note:</h4>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add your note about this applicant..."
            rows={3}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] mb-3"
          />
          
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={loading || !newNote.trim()}
              className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddNote(false);
                setNewNote('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!notes && !isEditing && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No team notes yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Add notes to keep track of team thoughts about this candidate
          </p>
        </div>
      )}
    </div>
  );
}