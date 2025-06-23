// src/components/settings/CompanySwitcher.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Building2, ChevronDown, Check } from 'lucide-react';

export default function CompanySwitcher({ onCompanyChange }) {
  const { companies, company, switchCompany, fetchUserCompanies } = useStore(state => ({
    companies: state.companies,
    company: state.company,
    switchCompany: state.switchCompany,
    fetchUserCompanies: state.fetchUserCompanies
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch companies if not already loaded
    if (!companies || companies.length === 0) {
      fetchUserCompanies();
    }
  }, []);

  const handleCompanySwitch = async (companyId) => {
    if (companyId === company?.id) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      await switchCompany(companyId);
      
      // Notify parent component of change
      if (onCompanyChange) {
        onCompanyChange(companyId);
      }
    } catch (error) {
      console.error('Failed to switch company:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Don't render if only one company
  if (!companies || companies.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-3 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <div className="flex-1 text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Company</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {company?.name || 'Select Company'}
          </p>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="py-2">
            {companies.map((comp) => (
              <button
                key={comp.id}
                onClick={() => handleCompanySwitch(comp.id)}
                className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{comp.name}</span>
                </div>
                {comp.id === company?.id && (
                  <Check className="h-4 w-4 text-[#0CCE68]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0CCE68]"></div>
        </div>
      )}
    </div>
  );
}