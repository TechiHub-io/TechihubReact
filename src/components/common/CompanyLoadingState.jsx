// src/components/common/CompanyLoadingState.jsx
const CompanyLoadingState = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CCE68] mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking company status...</p>
      </div>
    </div>
  );
};

export default CompanyLoadingState;