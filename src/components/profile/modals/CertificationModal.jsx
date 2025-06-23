// src/components/profile/modals/CertificationModal.jsx
import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { X, Save, Clock } from 'lucide-react';

export default function CertificationModal({ certification, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addCertification, updateCertification } = useStore(state => ({
    addCertification: state.addCertification,
    updateCertification: state.updateCertification
  }));

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    year_awarded: new Date().getFullYear(),
    credential_url: ''
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name || '',
        institution: certification.institution || '',
        year_awarded: certification.year_awarded || new Date().getFullYear(),
        credential_url: certification.credential_url || ''
      });
    }
  }, [certification]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (certification) {
        await updateCertification(certification.id, formData);
      } else {
        await addCertification(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= currentYear - 50; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {certification ? 'Edit Certification' : 'Add Certification'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. AWS Certified Solutions Architect"
              className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Issuing Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              placeholder="e.g. Amazon Web Services"
              className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Year Awarded <span className="text-red-500">*</span>
           </label>
           <select
             name="year_awarded"
             value={formData.year_awarded}
             onChange={handleChange}
             required
             className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
           >
             <option value="">Select year</option>
             {yearOptions.map(year => (
               <option key={year} value={year}>
                 {year}
               </option>
             ))}
           </select>
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Credential URL
           </label>
           <input
             type="url"
             name="credential_url"
             value={formData.credential_url}
             onChange={handleChange}
             placeholder="https://www.youracclaim.com/badges/..."
             className="shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68] block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
           />
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
             Link to view or verify this certification
           </p>
         </div>

         <div className="flex justify-end space-x-3 pt-4">
           <button
             type="button"
             onClick={onClose}
             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={loading}
             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             {loading ? (
               <span className="flex items-center">
                 <Clock className="animate-spin h-4 w-4 mr-2" />
                 Saving...
               </span>
             ) : (
               <span className="flex items-center">
                 <Save className="h-4 w-4 mr-2" />
                 {certification ? 'Update' : 'Add'} Certification
               </span>
             )}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
}