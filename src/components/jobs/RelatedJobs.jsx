// src/components/jobs/RelatedJobs.jsx
import JobCard from './JobCard';

export default function RelatedJobs({ jobs = [] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Related Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No related jobs found</p>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
}