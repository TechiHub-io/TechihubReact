// src/components/admin/CompanyInfoDisplay.jsx
'use client';
import React from 'react';
import { Building2, MapPin, Globe, Users, Calendar, ExternalLink } from 'lucide-react';

export default function CompanyInfoDisplay({
  company,
  loading = false,
  className = '',
  showFullDetails = true,
  compact = false
}) {
  if (loading) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          {showFullDetails && !compact && (
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center ${className}`}>
        <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No company selected
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {company.name}
            </h3>
            {company.location && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{company.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {company.name}
          </h3>
          {company.industry && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {company.industry}
            </p>
          )}
          {company.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{company.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Company Details */}
      {showFullDetails && (
        <div className="space-y-3">
          {/* Description */}
          {company.description && (
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {company.description}
              </p>
            </div>
          )}

          {/* Company Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {company.size && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{company.size}</span>
              </div>
            )}
            {company.foundingDate && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Founded {new Date(company.foundingDate).getFullYear()}</span>
              </div>
            )}
            {company.jobCount !== undefined && (
              <div className="flex items-center">
                <span className="font-medium">{company.jobCount}</span>
                <span className="ml-1">active jobs</span>
              </div>
            )}
          </div>

          {/* Links */}
          {company.website && (
            <div className="pt-2">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-[#0CCE68] hover:text-[#0BBE58] transition-colors"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span>Visit website</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          )}

          {/* Admin Access Info */}
          {company.adminAccess && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Admin access granted</span>
                {company.adminAccess.grantedAt && (
                  <span>
                    {new Date(company.adminAccess.grantedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}