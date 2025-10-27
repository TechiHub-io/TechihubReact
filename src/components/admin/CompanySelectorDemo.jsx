// src/components/admin/CompanySelectorDemo.jsx
'use client';
import React, { useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import CompanySelector from './CompanySelector';
import CompanyInfoDisplay from './CompanyInfoDisplay';
import CompanyAccessValidator from './CompanyAccessValidator';

/**
 * Demo component showing how to use the company selection components together
 * This demonstrates the integration of CompanySelector, CompanyInfoDisplay, and CompanyAccessValidator
 */
export default function CompanySelectorDemo() {
  const {
    isAdmin,
    accessibleCompanies,
    companiesLoading,
    companiesError,
    getCompanyById
  } = useAdminAuth();

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const selectedCompany = selectedCompanyId ? getCompanyById(selectedCompanyId) : null;

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
    setValidationError(null);
  };

  const handleValidationChange = (isValid, error) => {
    setValidationError(error);
    if (!isValid && selectedCompanyId) {
      // Optionally clear selection if validation fails
      // setSelectedCompanyId(null);
    }
  };

  const handleAccessRevoked = (companyId, company) => {
    console.log('Access revoked for company:', company?.name);
    // Handle access revocation (e.g., show notification, clear selection)
    setSelectedCompanyId(null);
  };

  if (!isAdmin) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Admin access required to view this component.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Company Selection Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This demo shows how the admin company selection components work together.
        </p>
      </div>

      {/* Company Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Company
        </label>
        <CompanySelector
          companies={accessibleCompanies}
          selectedCompanyId={selectedCompanyId}
          onCompanySelect={handleCompanySelect}
          loading={companiesLoading}
          error={companiesError}
          placeholder="Choose a company to post jobs for..."
          className="max-w-md"
        />
      </div>

      {/* Company Access Validation */}
      {selectedCompanyId && (
        <CompanyAccessValidator
          companyId={selectedCompanyId}
          onValidationChange={handleValidationChange}
          onAccessRevoked={handleAccessRevoked}
          showValidationStatus={true}
          autoRefresh={true}
        >
          {/* Company Information Display */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Selected Company Details
            </h3>
            <CompanyInfoDisplay
              company={selectedCompany}
              loading={companiesLoading}
              showFullDetails={true}
              compact={false}
            />
          </div>

          {/* Compact version example */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Compact Display Example
            </h3>
            <CompanyInfoDisplay
              company={selectedCompany}
              loading={companiesLoading}
              showFullDetails={false}
              compact={true}
            />
          </div>
        </CompanyAccessValidator>
      )}

      {/* Status Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Status Information
        </h3>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <div>Admin Status: {isAdmin ? '✅ Verified' : '❌ Not Admin'}</div>
          <div>Accessible Companies: {accessibleCompanies.length}</div>
          <div>Selected Company: {selectedCompany?.name || 'None'}</div>
          <div>Validation Error: {validationError || 'None'}</div>
          <div>Companies Loading: {companiesLoading ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
}