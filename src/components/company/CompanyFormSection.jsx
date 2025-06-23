// src/components/company/CompanyFormSection.js
import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

const CompanyFormSection = ({ title, children, isOpen, toggleOpen, isComplete }) => {
  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className={`flex justify-between items-center p-4 cursor-pointer ${
          isOpen ? 'bg-blue-100' : 'bg-blue-100 hover:bg-blue-200'
        }`}
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          {isComplete && (
            <span className="ml-2 flex items-center justify-center h-5 w-5 bg-green-500 rounded-full">
              <Check size={12} color="white" />
            </span>
          )}
        </div>
        <span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>
      
      {isOpen && (
        <div className="border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default CompanyFormSection;