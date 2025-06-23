// src/components/company/CompanyCard.jsx
import Link from 'next/link';

export default function CompanyCard({ company }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={company?.logo || '/images/default-company.png'}
          alt={company?.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{company?.name}</h3>
          <p className="text-gray-600">{company?.industry}</p>
          <p className="text-sm text-gray-500 mt-1">{company?.location}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700 line-clamp-2">{company?.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{company?.size}</span>
          <span className="text-sm text-gray-600">{company?.job_count} jobs</span>
        </div>
        <Link href={`/company/${company?.id}`} className="text-[#0CCE68] hover:underline">
          View Profile
        </Link>
      </div>
    </div>
  );
}