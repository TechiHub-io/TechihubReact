// src/components/applications/QuickMessageComposer.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApplicationMessaging } from '@/hooks/useApplicationMessaging';
import { useMessages } from '@/hooks/useMessages';
import { 
  MessageCircle, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const MESSAGE_TEMPLATES = [
  {
    id: 'thanks-reviewing',
    label: 'Thank for applying',
    content: 'Thank you for your application! We are currently reviewing your submission and will get back to you soon.'
  },
  {
    id: 'schedule-interview',
    label: 'Schedule interview',
    content: 'We would like to schedule an interview with you. Are you available this week? Please let us know your preferred times.'
  },
  {
    id: 'request-info',
    label: 'Request additional info',
    content: 'Thank you for your application. Could you please provide additional information about your experience with [specific skill/area]?'
  },
  {
    id: 'status-update',
    label: 'Provide status update',
    content: 'We wanted to provide you with an update on your application status. We are currently in the [review/interview/final] stage of our process.'
  },
  {
    id: 'request-documents',
    label: 'Request documents',
    content: 'Could you please provide the following documents: [list documents needed]. You can reply to this message with the attachments.'
  },
  {
    id: 'next-steps',
    label: 'Explain next steps',
    content: 'The next step in our process is [describe next step]. We expect to complete this stage by [timeframe] and will update you accordingly.'
  }
];

export default function QuickMessageComposer({ application, className = '' }) {
  const router = useRouter();
  const { startConversationWithApplicant, loading: conversationLoading, error: conversationError } = useApplicationMessaging();
  const { sendMessage, loading: messageLoading, error: messageError, clearError } = useMessages();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [sendStatus, setSendStatus] = useState(null); // 'sending', 'success', 'error'
  
  const textareaRef = useRef(null);

  // Get applicant name for display
  const applicantName = application?.user?.first_name && application?.user?.last_name 
    ? `${application.user.first_name} ${application.user.last_name}`
    : application?.user?.email?.split('@')[0] || 'Applicant';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageContent]);

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    if (!templateId) {
      setMessageContent('');
      setSelectedTemplate('');
      return;
    }

    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setMessageContent(template.content);
      setSelectedTemplate(templateId);
      
      // Focus textarea after template selection
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
      }, 100);
    }
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    setSendStatus('sending');
    clearError();

    try {
      let currentConversationId = conversationId;

      // If no conversation exists, create one
      if (!currentConversationId || isFirstMessage) {
        const conversation = await startConversationWithApplicant(application);
        if (conversation && conversation.id) {
          currentConversationId = conversation.id;
          setConversationId(conversation.id);
          setIsFirstMessage(false);
        } else {
          throw new Error('Failed to create conversation');
        }
      }

      // Send the message
      const sentMessage = await sendMessage(currentConversationId, messageContent.trim());
      
      if (sentMessage) {
        setSendStatus('success');
        setMessageContent('');
        setSelectedTemplate('');
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          setSendStatus(null);
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendStatus('error');
      
      // Clear error status after 5 seconds
      setTimeout(() => {
        setSendStatus(null);
      }, 5000);
    }
  };

  // Handle expand/collapse
  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setSendStatus(null);
    clearError();
  };

  // Handle view full conversation
  const handleViewFullConversation = () => {
    if (conversationId) {
      router.push(`/messages/${conversationId}`);
    }
  };

  const isLoading = conversationLoading || messageLoading;
  const hasError = conversationError || messageError;

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggleExpanded}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
      >
        <div className="flex items-center">
          <MessageCircle className="w-4 h-4 mr-2 text-[#0CCE68]" />
          <span className="font-medium text-gray-900 dark:text-white">
            Message {applicantName}
          </span>
          {sendStatus === 'success' && (
            <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {/* Status Messages */}
          {sendStatus === 'success' && (
            <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-700 dark:text-green-300 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Message sent successfully!
            </div>
          )}

          {(sendStatus === 'error' || hasError) && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {conversationError || messageError || 'Failed to send message. Please try again.'}
            </div>
          )}

          {/* Template Selector */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quick Templates (Optional)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0CCE68] focus:border-[#0CCE68]"
            >
              <option value="">Choose a template...</option>
              {MESSAGE_TEMPLATES.map(template => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message Composer */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              ref={textareaRef}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder={`Write a message to ${applicantName}...`}
              rows={3}
              className="w-full text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0CCE68] focus:border-[#0CCE68] resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {messageContent.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {conversationId && !isFirstMessage && (
                <button
                  onClick={handleViewFullConversation}
                  className="text-xs text-[#0CCE68] hover:text-[#0BBE58] flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Full Conversation
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setMessageContent('');
                  setSelectedTemplate('');
                  setSendStatus(null);
                }}
                className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || isLoading || sendStatus === 'sending'}
                className="px-3 py-1.5 bg-[#0CCE68] text-white text-xs rounded hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {sendStatus === 'sending' ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-1" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}