// src/components/profile/PortfolioSection.jsx
import React from 'react';
import { Globe, PlusCircle, Edit, Trash } from 'lucide-react';

export default function PortfolioSection({ portfolioItems = [], isEditable = false, onEdit, onDelete }) {
  if (!portfolioItems || portfolioItems.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio</h2>
        <p className="text-gray-500 dark:text-gray-400">No portfolio items added yet.</p>
        {isEditable && (
          <button 
            onClick={() => onEdit()} 
            className="mt-4 px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            Add Portfolio Item
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio</h2>
        {isEditable && (
          <button 
            onClick={() => onEdit()} 
            className="flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioItems.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Portfolio image if available */}
            {item.image && (
              <div className="h-40 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {item.description.length > 100 
                    ? `${item.description.substring(0, 100)}...` 
                    : item.description}
                </p>
              )}
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-[#0CCE68] hover:underline"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  View Project
                </a>
              )}
            </div>
            
            {/* Edit/Delete buttons (visible on hover) */}
            {isEditable && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(item.id); }} 
                  className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-[#0CCE68] hover:text-[#0BBE58] shadow-sm"
                  aria-label="Edit portfolio item"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                  className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-red-500 hover:text-red-600 shadow-sm"
                  aria-label="Delete portfolio item"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}