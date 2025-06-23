// src/components/jobs/CompanyProfileLink.jsx 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompanyIds } from '@/hooks/useCompanyIds';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function CompanyProfileLink({ 
  job, 
  className = "",
  children,
  showIcon = true
}) {
  const { getCompanyId } = useCompanyIds();
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    if (companyId || loading) return;

    setClicked(true);
    setLoading(true);

    try {
      const fetchedCompanyId = await getCompanyId(job.id);
      setCompanyId(fetchedCompanyId);
    } catch (error) {
      console.error('Failed to get company ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if needed (optional)
  useEffect(() => {
    if (!clicked && !companyId && !loading) {
      // Optionally auto-fetch after a delay
      const timer = setTimeout(() => {
        handleClick();
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [clicked, companyId, loading]);

  if (companyId) {
    return (
      <Link
        href={`/dashboard/jobseeker/companies/${companyId}`}
        className={`inline-flex items-center ${className}`}
      >
        {children}
        {showIcon && <ExternalLink className="w-3 h-3 ml-1" />}
      </Link>
    );
  }

  if (loading) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin mr-1" />
        {children}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center hover:underline ${className}`}
    >
      {children}
      {showIcon && <ExternalLink className="w-3 h-3 ml-1 opacity-50" />}
    </button>
  );
}