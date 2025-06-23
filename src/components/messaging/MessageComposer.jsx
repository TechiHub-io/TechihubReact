// src/components/messaging/MessageComposer.jsx
import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

export default function MessageComposer({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || sending) {
      return;
    }

    setSending(true);
    try {
      const success = await onSendMessage(message.trim());
      if (success) {
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={disabled || sending}
              rows={1}
              className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '40px' }}
            />
            
            {/* Emoji button - placeholder for now */}
            <button
              type="button"
              className="absolute right-3 bottom-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={disabled || sending}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Attachment button - placeholder for now */}
        {/* <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          disabled={disabled || sending}
        >
          <Paperclip className="w-5 h-5" />
        </button> */}
        
        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || sending}
          className="p-2 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? (
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}