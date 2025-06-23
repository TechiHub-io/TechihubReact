// src/components/company/setup/SetupProgress.jsx
import React from 'react';

export default function SetupProgress({ currentStep, totalSteps, completionPercentage, steps }) {
  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">Setup Progress</span>
        <span className="text-sm font-medium text-gray-500">{completionPercentage}% complete</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-[#0CCE68] h-2.5 rounded-full" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      <div className="mt-6">
        <nav className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full 
                ${index + 1 < currentStep || step.complete ? 'bg-[#0CCE68] text-white' : 
                  index + 1 === currentStep ? 'border-2 border-[#0CCE68] text-[#0CCE68]' : 
                  'bg-gray-100 text-gray-500'}`}
              >
                {step.complete ? (
                  <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`mt-1 text-xs ${index + 1 === currentStep ? 'font-medium text-[#0CCE68]' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}