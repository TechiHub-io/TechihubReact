// src/app/sitemap.js - Dynamic sitemap generation
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Job filter pages
  const filterPages = [
    { url: `${baseUrl}/jobs/remote`, priority: 0.8 },
    { url: `${baseUrl}/jobs/type/full-time`, priority: 0.8 },
    { url: `${baseUrl}/jobs/type/part-time`, priority: 0.7 },
    { url: `${baseUrl}/jobs/type/contract`, priority: 0.7 },
    { url: `${baseUrl}/jobs/level/entry`, priority: 0.7 },
    { url: `${baseUrl}/jobs/level/mid`, priority: 0.8 },
    { url: `${baseUrl}/jobs/level/senior`, priority: 0.8 },
    { url: `${baseUrl}/jobs/skill/javascript`, priority: 0.7 },
    { url: `${baseUrl}/jobs/skill/python`, priority: 0.7 },
    { url: `${baseUrl}/jobs/skill/react`, priority: 0.7 },
    { url: `${baseUrl}/jobs/remote/type/full-time`, priority: 0.7 },
  ].map(page => ({
    ...page,
    lastModified: new Date(),
    changeFrequency: 'daily',
  }));

  try {
    // Fetch recent jobs for dynamic sitemap
    const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
    const response = await fetch(`${API_URL}/jobs/?page_size=100&is_active=true`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 } // Revalidate every hour instead of no-store
    });
    
    const jobPages = [];
    if (response.ok) {
      const data = await response.json();
      const jobs = data.results || data || [];
      
      jobs.forEach(job => {
        const companySlug = job.company_name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'company';
        const jobSlug = `${job.title}-at-${job.company_name}`
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        jobPages.push({
          url: `${baseUrl}/jobs/${companySlug}/${jobSlug}/${job.id}`,
          lastModified: new Date(job.updated_at || job.created_at),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });
    }
    
    return [...staticPages, ...filterPages, ...jobPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [...staticPages, ...filterPages];
  }
}