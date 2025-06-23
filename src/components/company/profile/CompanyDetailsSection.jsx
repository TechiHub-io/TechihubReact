// src/components/company/profile/CompanyDetailsSection.jsx
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useNotification } from '@/hooks/useNotification';
import { 
  Building, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  Save,
  X 
} from 'lucide-react';

export default function CompanyDetailsSection({ company, isOwner, companyId }) {
  const { updateCompany, isUpdatingCompany } = useCompany();
  const { showSuccess, showError } = useNotification();
  
  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: company?.description || ''
  });
  
  // Handle description change
  const handleDescriptionChange = (e) => {
    setEditData({
      ...editData,
      description: e.target.value
    });
  };
  
  // Start editing
  const startEditing = () => {
    setEditData({
      description: company?.description || ''
    });
    setIsEditing(true);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // Save updated description
  const saveDescription = async () => {
    try {
      await updateCompany({
        ...company,
        description: editData.description
      });
      
      showSuccess('Company description updated successfully');
      setIsEditing(false);
    } catch (err) {
      showError(err.message || 'Failed to update company description');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          About {company.name}
        </h2>
        
        { !isEditing && (
          <button
            onClick={startEditing}
            className="inline-flex items-center text-sm text-[#0CCE68] hover:text-[#0BBE58]"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Description
          </button>
        )}
      </div>
      
      {/* Company description */}
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editData.description}
            onChange={handleDescriptionChange}
            rows={5}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
            placeholder="Describe your company..."
          ></textarea>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
            >
              <X className="w-4 h-4 mr-1 inline" />
              Cancel
            </button>
            
            <button
              onClick={saveDescription}
              disabled={isUpdatingCompany}
              className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUpdatingCompany ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4 mr-1 inline" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
          {company.description ? (
            <p>{company.description}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No company description available.
              {isOwner && (
                <button
                  onClick={startEditing}
                  className="ml-2 text-[#0CCE68] hover:underline"
                >
                  Add description
                </button>
              )}
            </p>
          )}
        </div>
      )}
      
      {/* Company details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        {company.industry && (
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Building className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span><strong>Industry:</strong> {company.industry}</span>
          </div>
        )}
        
        {company.location && (
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span><strong>Location:</strong> {company.location}</span>
          </div>
        )}
        
        {company.size && (
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Building className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span><strong>Company Size:</strong> {company.size} employees</span>
          </div>
        )}
        
        {company.founding_date && (
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span>
              <strong>Founded:</strong> {new Date(company.founding_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}