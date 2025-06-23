// src/lib/utils/urlParser.js - Parse SEO-friendly URLs to filters
export const FILTER_TYPES = {
  'type': 'job_type',
  'level': 'experience_level',
  'location': 'location',
  'skill': 'skills',
  'salary': 'salary_range',
  'education': 'education_level',
  'posted': 'posted_within',
  'company': 'company',
  'category': 'category'
};

export const REVERSE_FILTER_TYPES = Object.fromEntries(
  Object.entries(FILTER_TYPES).map(([k, v]) => [v, k])
);

// Parse URL path to filters
export function parseUrlToFilters(pathSegments) {
  const filters = {
    location: '',
    remote: false,
    job_type: '',
    experience_level: '',
    min_salary: '',
    max_salary: '',
    skills: [],
    posted_within: '',
    education_level: '',
    company: '',
    category: ''
  };

  // Handle special case for "remote"
  if (pathSegments.includes('remote')) {
    filters.remote = true;
    // Remove remote from segments for further processing
    pathSegments = pathSegments.filter(segment => segment !== 'remote');
  }

  // Process pairs of [filter-type, filter-value]
  for (let i = 0; i < pathSegments.length; i += 2) {
    const filterType = pathSegments[i];
    const filterValue = pathSegments[i + 1];

    if (!filterValue) continue;

    // Convert URL filter type to internal filter name
    const internalFilterName = FILTER_TYPES[filterType];
    if (!internalFilterName) continue;

    // Handle special cases
    if (internalFilterName === 'skills') {
      // Skills can be multiple, so add to array
      filters.skills.push(decodeURIComponent(filterValue.replace(/-/g, ' ')));
    } else if (internalFilterName === 'salary_range') {
      // Parse salary range like "100k-150k"
      const [min, max] = filterValue.split('-');
      if (min) filters.min_salary = parseSalaryValue(min);
      if (max) filters.max_salary = parseSalaryValue(max);
    } else {
      // Regular filter
      filters[internalFilterName] = decodeURIComponent(filterValue.replace(/-/g, ' '));
    }
  }

  return filters;
}

// Convert filters to URL path
export function filtersToUrlPath(filters) {
  const pathSegments = [];

  // Add remote first if true
  if (filters.remote) {
    pathSegments.push('remote');
  }

  // Add other filters
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || key === 'remote') return;

    const urlFilterType = REVERSE_FILTER_TYPES[key];
    if (!urlFilterType) return;

    if (key === 'skills' && Array.isArray(value) && value.length > 0) {
      // Add each skill
      value.forEach(skill => {
        pathSegments.push('skill', encodeURIComponent(skill.replace(/\s+/g, '-')));
      });
    } else if (key === 'min_salary' || key === 'max_salary') {
      // Handle salary range
      if (filters.min_salary || filters.max_salary) {
        const min = filters.min_salary ? formatSalaryForUrl(filters.min_salary) : '';
        const max = filters.max_salary ? formatSalaryForUrl(filters.max_salary) : '';
        if (min || max) {
          pathSegments.push('salary', `${min}-${max}`);
        }
      }
    } else if (typeof value === 'string' && value.trim()) {
      pathSegments.push(urlFilterType, encodeURIComponent(value.replace(/\s+/g, '-')));
    }
  });

  return pathSegments.join('/');
}

// Helper function to parse salary values
function parseSalaryValue(salaryStr) {
  if (!salaryStr) return '';
  
  // Remove 'k' and convert to full number
  const cleanStr = salaryStr.toLowerCase().replace('k', '');
  const number = parseInt(cleanStr, 10);
  
  if (isNaN(number)) return '';
  
  return (number * 1000).toString();
}

// Helper function to format salary for URL
function formatSalaryForUrl(salary) {
  if (!salary) return '';
  
  const number = parseInt(salary, 10);
  if (isNaN(number)) return '';
  
  // Convert to "k" format (e.g., 100000 -> "100k")
  return `${Math.floor(number / 1000)}k`;
}

// Generate job slug from job data
export function generateJobSlug(job) {
  if (!job) return '';
  
  const title = job.title || '';
  const company = job.company_name || '';
  
  // Create slug: "job-title-at-company"
  const slug = `${title}-at-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
  
  return slug;
}

// Parse job URL to get job ID and validate slug
export function parseJobUrl(companySlug, jobSlug, jobId) {
  return {
    companySlug: decodeURIComponent(companySlug),
    jobSlug: decodeURIComponent(jobSlug),
    jobId: jobId
  };
}

// Generate meta tags for job
export function generateJobMetaTags(job) {
  if (!job) return {};
  
  const title = `${job.title} at ${job.company_name} | TechHub Jobs`;
  const description = job.description 
    ? `${job.description.substring(0, 155)}...`
    : `Join ${job.company_name} as ${job.title}. ${job.location ? `Located in ${job.location}.` : ''} Apply now on TechHub.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/jobs/${generateJobSlug(job)}/${job.id}`,
      images: job.company_logo ? [{
        url: job.company_logo,
        width: 400,
        height: 400,
        alt: `${job.company_name} logo`
      }] : []
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: job.company_logo ? [job.company_logo] : []
    }
  };
}

// Generate breadcrumbs for job pages
// Generate breadcrumbs for job pages
export function generateBreadcrumbs(pathSegments, job = null) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' }
  ];

  if (job) {
    // Individual job page - check if company_name exists and is valid
    if (job.company_name) {
      breadcrumbs.push({
        label: job.company_name,
        href: `/jobs/company/${job.company_name.toLowerCase().replace(/\s+/g, '-')}`
      });
    }
    breadcrumbs.push({
      label: job.title || 'Job Details',
      href: null // Current page
    });
  } else if (pathSegments.length > 0) {
    // Filter pages
    let currentPath = '/jobs';
    
    // Handle special case for "remote"
    if (pathSegments.includes('remote')) {
      currentPath += '/remote';
      breadcrumbs.push({
        label: 'Remote Jobs',
        href: currentPath
      });
    }
    
    for (let i = 0; i < pathSegments.length; i += 2) {
      const filterType = pathSegments[i];
      const filterValue = pathSegments[i + 1];
      
      // Skip if this is the "remote" we already handled
      if (filterType === 'remote') continue;
      
      if (filterValue) {
        currentPath += `/${filterType}/${filterValue}`;
        const displayLabel = filterValue.replace(/-/g, ' ');
        const filterLabel = getFilterDisplayName(filterType);
        
        breadcrumbs.push({
          label: `${filterLabel}: ${displayLabel}`,
          href: currentPath
        });
      }
    }
  }

  return breadcrumbs;
}

// Helper function to get user-friendly filter names
function getFilterDisplayName(filterType) {
  const displayNames = {
    'type': 'Job Type',
    'level': 'Experience Level',
    'location': 'Location',
    'skill': 'Skill',
    'salary': 'Salary Range',
    'education': 'Education Level',
    'posted': 'Posted',
    'company': 'Company',
    'category': 'Category'
  };
  
  return displayNames[filterType] || filterType;
}