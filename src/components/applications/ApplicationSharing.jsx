// src/components/applications/ApplicationSharing.jsx
import React, { useState, useEffect } from 'react';
import { useTeamCollaboration } from '@/hooks/useTeamCollaboration';
import { useTeam } from '@/hooks/useTeam';
import { useStore } from '@/hooks/useZustandStore';
import { 
  Share2, 
  Users, 
  Send, 
  X,
  Check,
  Mail
} from 'lucide-react';

export default function ApplicationSharing({ 
  applicationId, 
  applicantName,
  isOpen, 
  onClose 
}) {
  const { shareApplication, loading, error } = useTeamCollaboration();
  const { members, fetchTeamMembers } = useTeam();
  const { company } = useStore(state => ({ company: state.company }));
  
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Load team members
  useEffect(() => {
    if (isOpen && company?.id) {
      fetchTeamMembers(company.id);
    }
  }, [isOpen, company?.id, fetchTeamMembers]);

  // Handle member selection
  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle share
  const handleShare = async (e) => {
    e.preventDefault();
    
    if (selectedMembers.length === 0) return;

    try {
      await shareApplication(applicationId, selectedMembers, message);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setSelectedMembers([]);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Failed to share application:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedMembers([]);
    setMessage('');
    setSuccess(false);
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
           <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
               <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
               Application Shared Successfully
             </h3>
             <p className="text-sm text-gray-600 dark:text-gray-400">
               {selectedMembers.length} team member{selectedMembers.length !== 1 ? 's' : ''} will be notified about {applicantName}'s application.
             </p>
           </div>
         </div>
       </div>
     </div>
   );
 }

 return (
   <div className="fixed inset-0 z-50 overflow-y-auto">
     <div className="flex min-h-screen items-center justify-center p-4">
       {/* Backdrop */}
       <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
       
       {/* Modal */}
       <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
         {/* Header */}
         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
           <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
             <Share2 className="w-5 h-5 mr-2" />
             Share Application
           </h2>
           <button
             onClick={handleClose}
             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
           >
             <X className="w-6 h-6" />
           </button>
         </div>

         {/* Content */}
         <form onSubmit={handleShare} className="p-6">
           <p className="text-gray-600 dark:text-gray-400 mb-6">
             Share {applicantName}'s application with your team members for their feedback and review.
           </p>

           {/* Team Members Selection */}
           <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
               Select Team Members
             </label>
             
             {members.length === 0 ? (
               <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                 <Users className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                 <p>No team members found</p>
                 <p className="text-sm">Invite team members to collaborate on applications</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                 {members.map((member) => (
                   <label
                     key={member.id}
                     className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                       selectedMembers.includes(member.id)
                         ? 'border-[#0CCE68] bg-[#0CCE68]/5'
                         : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                     }`}
                   >
                     <input
                       type="checkbox"
                       checked={selectedMembers.includes(member.id)}
                       onChange={() => handleMemberToggle(member.id)}
                       className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
                     />
                     
                     <div className="ml-3 flex items-center flex-1">
                       {member.user?.profile_picture ? (
                         <img
                           src={member.user.profile_picture}
                           alt={member.user.full_name}
                           className="w-8 h-8 rounded-full mr-3"
                         />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                           <Users className="w-4 h-4 text-gray-500" />
                         </div>
                       )}
                       
                       <div className="min-w-0 flex-1">
                         <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                           {member.user?.full_name || 'Unknown Member'}
                         </p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                           {member.role || 'Team Member'}
                         </p>
                       </div>
                     </div>
                   </label>
                 ))}
               </div>
             )}
           </div>

           {/* Message */}
           <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Message (optional)
             </label>
             <textarea
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Add a message for your team members..."
               rows={3}
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
             />
           </div>

           {/* Error Message */}
           {error && (
             <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
               {error}
             </div>
           )}

           {/* Actions */}
           <div className="flex justify-end space-x-3">
             <button
               type="button"
               onClick={handleClose}
               className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={loading || selectedMembers.length === 0}
               className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               {loading ? (
                 <>
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                   Sharing...
                 </>
               ) : (
                 <>
                   <Send className="w-4 h-4 mr-2" />
                   Share with {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
                 </>
               )}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}