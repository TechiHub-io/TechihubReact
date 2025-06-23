// src/components/messaging/MessageBubble.jsx
import React from 'react';
import { formatDate } from '@/lib/utils/date';
import { User, Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message }) {
  // Determine if this message is from the current user
  // For now, we'll use a simple check - in a real app you'd compare with current user ID
  const isFromCurrentUser = message.is_from_current_user || false;
  
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isFromCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isFromCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {message.sender?.profile_picture ? (
                <img 
                  src={message.sender.profile_picture} 
                  alt={message.sender.full_name || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}
            </div>
          </div>
        )}
        
        {/* Message Content */}
        <div className={`rounded-lg px-4 py-2 ${
          isFromCurrentUser 
            ? 'bg-[#0CCE68] text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}>
          {/* Sender name for received messages */}
          {!isFromCurrentUser && message.sender && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {message.sender.full_name || message.sender.first_name || 'Unknown'}
            </p>
          )}
          
          {/* Message content */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Timestamp and read status */}
          <div className={`flex items-center mt-2 text-xs ${
            isFromCurrentUser 
              ? 'text-white/70' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span>{formatMessageTime(message.created_at)}</span>
            
            {isFromCurrentUser && (
              <div className="ml-2">
                {message.is_read ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}