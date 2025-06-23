// src/components/company/setup/CompanyBenefitsForm.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { 
  PlusCircle, 
  X, 
  Heart, 
  Shield, 
  Home, 
  GraduationCap, 
  Coffee,
  Car,
  Gift,
  Clock,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  Check
} from 'lucide-react';

export default function CompanyBenefitsForm({ onComplete, onBack, onSkip }) {
  const { company, addCompanyBenefit, error } = useStore(state => ({
    company: state.company,
    addCompanyBenefit: state.addCompanyBenefit,
    error: state.error
  }));

  const [benefits, setBenefits] = useState([]);
  const [pendingBenefits, setPendingBenefits] = useState([]);
  const [newBenefit, setNewBenefit] = useState({ title: '', description: '', icon: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Popular benefits with icons and categories
  const popularBenefits = [
    { category: "Health & Wellness", icon: Heart, benefits: [
      { title: "Health Insurance", description: "Comprehensive medical coverage", icon: "health" },
      { title: "Dental & Vision", description: "Complete dental and vision care", icon: "dental" },
      { title: "Mental Health Support", description: "Counseling and wellness programs", icon: "mental" },
      { title: "Gym Membership", description: "Fitness and wellness reimbursement", icon: "gym" }
    ]},
    { category: "Work-Life Balance", icon: Home, benefits: [
      { title: "Remote Work", description: "Flexible remote work options", icon: "remote" },
      { title: "Flexible Hours", description: "Choose your working hours", icon: "flextime" },
      { title: "Unlimited PTO", description: "Take time off when you need it", icon: "pto" },
      { title: "4-Day Work Week", description: "Better work-life balance", icon: "workweek" }
    ]},
    { category: "Growth & Learning", icon: GraduationCap, benefits: [
      { title: "Learning Budget", description: "Annual education allowance", icon: "education" },
      { title: "Conference Attendance", description: "Industry events and networking", icon: "conference" },
      { title: "Certification Support", description: "Professional certification reimbursement", icon: "certification" },
      { title: "Mentorship Program", description: "Career guidance and development", icon: "mentorship" }
    ]},
    { category: "Perks & Rewards", icon: Gift, benefits: [
      { title: "Free Meals", description: "Catered lunches and snacks", icon: "food" },
      { title: "Commuter Benefits", description: "Transportation reimbursement", icon: "commuter" },
      { title: "Equipment Stipend", description: "Home office setup allowance", icon: "equipment" },
      { title: "Stock Options", description: "Equity participation", icon: "equity" }
    ]}
  ];

  // Populate benefits from company if available
  useEffect(() => {
    if (company?.benefits) {
      setBenefits(company.benefits);
    }
  }, [company]);

  const handleBenefitChange = (e) => {
    const { name, value } = e.target;
    setNewBenefit(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationError) {
      setValidationError('');
    }
  };

  const handleAddPopularBenefit = (benefit) => {
    // Check if benefit already exists
    const exists = [...benefits, ...pendingBenefits].some(b => 
      b.title.toLowerCase() === benefit.title.toLowerCase()
    );
    
    if (!exists) {
      setPendingBenefits(prev => [...prev, {
        ...benefit,
        id: Date.now()
      }]);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }
  };

  const handleAddBenefit = (e) => {
    e.preventDefault();
    
    if (!newBenefit.title.trim()) {
      setValidationError('Benefit title is required');
      return;
    }
    
    setPendingBenefits(prev => [...prev, {...newBenefit, id: Date.now()}]);
    setNewBenefit({ title: '', description: '', icon: '' });
    setIsAdding(false);
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleRemovePendingBenefit = (id) => {
    setPendingBenefits(prev => prev.filter(benefit => benefit.id !== id));
  };

  const handleSubmitAllBenefits = async () => {
    if (pendingBenefits.length === 0) {
      onComplete();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      for (const benefit of pendingBenefits) {
        await addCompanyBenefit(benefit);
      }
      
      setPendingBenefits([]);
      onComplete();
    } catch (err) {
      console.error('Error adding benefits:', err);
      setValidationError('Failed to save benefits. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBenefitIcon = (iconName) => {
    const iconMap = {
      health: Heart,
      dental: Shield,
      remote: Home,
      flextime: Clock,
      education: GraduationCap,
      food: Coffee,
      gym: Heart,
      pto: Clock,
      commuter: Car,
      equipment: Gift
    };
    
    const IconComponent = iconMap[iconName] || Gift;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-4">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Showcase Your Benefits
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Highlight the perks and benefits that make your company attractive to top talent
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {validationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {showSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center">
          <Check className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Benefit added to your package!</span>
        </div>
      )}

      {/* Quick Add - Popular Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
          Popular Benefits
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Click to quickly add popular benefits that candidates love
        </p>
        
        <div className="space-y-6">
          {popularBenefits.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={categoryIndex}>
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <CategoryIcon className="h-4 w-4 mr-2 text-[#0CCE68]" />
                  {category.category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.benefits.map((benefit, benefitIndex) => {
                    const isAdded = [...benefits, ...pendingBenefits].some(b => 
                      b.title.toLowerCase() === benefit.title.toLowerCase()
                    );
                    
                    return (
                      <button
                        key={benefitIndex}
                        onClick={() => !isAdded && handleAddPopularBenefit(benefit)}
                        disabled={isAdded}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                          isAdded 
                            ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-[#0CCE68] hover:shadow-md transform hover:scale-[1.02]'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 ${isAdded ? 'text-green-600' : 'text-[#0CCE68]'}`}>
                            {getBenefitIcon(benefit.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className={`text-sm font-medium ${
                              isAdded ? 'text-green-800 dark:text-green-400' : 'text-gray-900 dark:text-white'
                            }`}>
                              {benefit.title} {isAdded && '✓'}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Benefits */}
      {benefits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.id || index} 
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-[#0CCE68]">
                    {getBenefitIcon(benefit.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{benefit.title}</h4>
                    {benefit.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{benefit.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Benefits */}
      {pendingBenefits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            New Benefits <span className="text-sm font-normal text-gray-500">(Not yet saved)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBenefits.map((benefit) => (
              <div 
                key={benefit.id} 
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm relative"
              >
                <button 
                  onClick={() => handleRemovePendingBenefit(benefit.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start space-x-3 pr-6">
                  <div className="flex-shrink-0 text-[#0CCE68]">
                    {getBenefitIcon(benefit.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{benefit.title}</h4>
                    {benefit.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{benefit.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Benefit Form */}
      {isAdding ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Custom Benefit</h3>
          <form onSubmit={handleAddBenefit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Benefit Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newBenefit.title}
                onChange={handleBenefitChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCfocus:border-[#0CCE68] transition-all duration-200"
               placeholder="e.g. Pet-Friendly Office"
             />
           </div>
           
           <div>
             <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Description
             </label>
             <textarea
               id="description"
               name="description"
               rows={3}
               value={newBenefit.description}
               onChange={handleBenefitChange}
               className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 resize-none"
               placeholder="Describe this benefit in detail"
             />
           </div>
           
           <div className="flex justify-end space-x-3">
             <button
               type="button"
               onClick={() => setIsAdding(false)}
               className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="px-6 py-2 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] transition-colors"
             >
               Add Benefit
             </button>
           </div>
         </form>
       </div>
     ) : (
       <div className="text-center">
         <button
           onClick={() => setIsAdding(true)}
           className="inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:border-[#0CCE68] hover:text-[#0CCE68] transition-all duration-200 group"
         >
           <PlusCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
           Add Custom Benefit
         </button>
       </div>
     )}

     {/* Information Note */}
     <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
       <div className="flex">
         <div className="flex-shrink-0">
           <Sparkles className="h-5 w-5 text-blue-500" />
         </div>
         <div className="ml-3 text-sm text-blue-700 dark:text-blue-400">
           <p className="font-medium">Benefits that attract talent:</p>
           <p className="mt-1">Companies with comprehensive benefits packages receive 50% more quality applications. Focus on what makes your workplace unique!</p>
           {pendingBenefits.length > 0 && (
             <p className="mt-2 font-medium">
               You have {pendingBenefits.length} unsaved benefit{pendingBenefits.length > 1 ? 's' : ''}. They'll be saved when you continue.
             </p>
           )}
         </div>
       </div>
     </div>

     {/* Navigation */}
     <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
       <button
         onClick={onBack}
         className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
       >
         <ChevronLeft className="h-4 w-4 mr-1" />
         Back
       </button>
       
       <div className="flex items-center space-x-4">
         <button
           onClick={onSkip}
           className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
         >
           Skip for now
         </button>
         
         <button
           onClick={handleSubmitAllBenefits}
           disabled={isSubmitting}
           className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
         >
           {isSubmitting ? (
             <span className="flex items-center">
               <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Saving benefits...
             </span>
           ) : (
             <span className="flex items-center">
               <Gift className="h-5 w-5 mr-2" />
               Continue to Logo
             </span>
           )}
         </button>
       </div>
     </div>
   </div>
 );
}