// src/components/company/profile/CompanyBenefitsSection.jsx
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useNotification } from '@/hooks/useNotification';
import { HeartHandshake, Plus, Trash2, Save, X } from 'lucide-react';

export default function CompanyBenefitsSection({ isOwner, companyId }) {
  const {company, addCompanyBenefit, deleteBenefit, error, isAddingBenefit } = useCompany();
  const { showSuccess, showError } = useNotification();
  
  // States for adding/editing benefits
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newBenefit, setNewBenefit] = useState({ title: '', description: '', icon: 'heart' });
  
  // Available icons for benefits
  const iconOptions = [
    { value: 'heart', label: 'Heart' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'home', label: 'Home' },
    { value: 'gift', label: 'Gift' },
    { value: 'dollar', label: 'Dollar' },
    { value: 'health', label: 'Health' },
    { value: 'book', label: 'Education' },
    { value: 'calendar', label: 'Time Off' },
  ];
  
  // Handle input changes for new benefit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBenefit(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding a new benefit
  const handleAddBenefit = async () => {
    if (!newBenefit.title || !newBenefit.description) {
      showError('Please provide a title and description for the benefit');
      return;
    }
    
    try {
      await addCompanyBenefit(newBenefit);
      showSuccess('Benefit added successfully');
      setIsAddingMode(false);
      setNewBenefit({ title: '', description: '', icon: 'heart' });
    } catch (err) {
      showError(err.message || 'Failed to add benefit');
    }
  };
  
  // Handle deleting a benefit
  const handleDeleteBenefit = async (benefitId) => {
    if (!window.confirm('Are you sure you want to delete this benefit?')) {
      return;
    }
    
    try {
      await deleteBenefit(companyId, benefitId);
      showSuccess('Benefit deleted successfully');
    } catch (err) {
      showError(err.message || 'Failed to delete benefit');
    }
  };
  
  // Cancel adding a new benefit
  const handleCancelAdd = () => {
    setIsAddingMode(false);
    setNewBenefit({ title: '', description: '', icon: 'heart' });
  };
  
  // Get icon component based on string name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'heart':
        return <HeartHandshake className="w-5 h-5" />;
      case 'coffee':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z M4 10h16" /></svg>;
      case 'home':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0a1 1 0 00-1 1v3m-3-3a1 1 0 00-1 1v3" /></svg>;
      case 'gift':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
      case 'dollar':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'health':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
      case 'book':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      case 'calendar':
        return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      default:
        return <HeartHandshake className="w-5 h-5" />;
    }
  };
  
  const hasBenefits = company.benefits && company.benefits.length > 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Company Benefits
        </h2>
        
        { !isAddingMode && (
          <button
            onClick={() => setIsAddingMode(true)}
            className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Benefit
          </button>
        )}
      </div>
      
      {/* Add new benefit form */}
      {isAddingMode && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Add New Benefit
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newBenefit.title}
                onChange={handleInputChange}
               
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                placeholder="e.g. Flexible Working Hours"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={newBenefit.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                placeholder="Describe the benefit..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon
              </label>
              <select
                id="icon"
                name="icon"
                value={newBenefit.icon}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              >
                <X className="w-4 h-4 mr-1 inline" />
                Cancel
              </button>
              
              <button
                onClick={handleAddBenefit}
                disabled={isAddingBenefit}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isAddingBenefit ? 'Adding...' : (
                  <>
                    <Save className="w-4 h-4 mr-1 inline" />
                    Add Benefit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Benefits grid */}
      {hasBenefits ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {company.benefits.map((benefit) => (
            <div 
              key={benefit.id} 
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md relative"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-[#0CCE68]/10 dark:bg-[#0CCE68]/20 rounded-full mr-3">
                  {getIconComponent(benefit.icon)}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {benefit.description}
                  </p>
                </div>
                
                { (
                  <button
                    onClick={() => handleDeleteBenefit(benefit.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    aria-label="Delete benefit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-md">
          <HeartHandshake className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400">No benefits listed yet</p>
          {!isAddingMode && (
            <button
              onClick={() => setIsAddingMode(true)}
              className="mt-2 text-[#0CCE68] hover:underline text-sm"
            >
              + Add your first benefit
            </button>
          )}
        </div>
      )}
    </div>
  );
}