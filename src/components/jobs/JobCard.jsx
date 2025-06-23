// src/components/jobs/JobCard.jsx
import Link from 'next/link';

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{job?.title}</h3>
          <p className="text-gray-600">{job?.company}</p>
          <p className="text-sm text-gray-500 mt-2">{job?.location}</p>
        </div>
        <span className="px-3 py-1 bg-[#0CCE68] text-white rounded-full text-sm">
          {job?.type}
        </span>
      </div>
      <p className="mt-4 text-gray-700 line-clamp-2">{job?.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-600">{job?.salary}</span>
        <Link href={`/jobs/${job?.id}`} className="text-[#0CCE68] hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}