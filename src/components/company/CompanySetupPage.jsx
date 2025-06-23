"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useZustandStore";
import Cookies from "js-cookie";
import { 
  Check, 
  Building, 
  Plus, 
  Upload, 
  Users, 
  Image as ImageIcon, 
  Star,
  Target
} from "lucide-react";

// Import the individual step components
import CompanyDetailsForm from "./setup/CompanyDetailsForm";
import CompanyBenefitsForm from "./setup/CompanyBenefitsForm";
import CompanyLogoUpload from "./setup/CompanyLogoUpload";
import CompanyImagesUpload from "./setup/CompanyImagesUpload";
import CompanyTeamInvite from "./setup/CompanyTeamInvite";

// Define steps with enhanced configuration
const SETUP_STEPS = {
  COMPANY_DETAILS: 1,
  COMPANY_BENEFITS: 2,
  COMPANY_LOGO: 3,
  COMPANY_IMAGES: 4,
  COMPANY_TEAM: 5,
};

const stepConfig = {
  1: { icon: Building, title: "Company Details", description: "Basic company information", color: "from-blue-500 to-cyan-600", required: true },
  2: { icon: Plus, title: "Benefits", description: "Employee benefits & perks", color: "from-green-500 to-emerald-600", required: false },
  3: { icon: Upload, title: "Logo", description: "Company branding", color: "from-purple-500 to-indigo-600", required: false },
  4: { icon: ImageIcon, title: "Gallery", description: "Workplace photos", color: "from-orange-500 to-red-600", required: false },
  5: { icon: Users, title: "Team", description: "Invite team members", color: "from-pink-500 to-rose-600", required: false },
};

export default function CompanySetupPage() {
  const router = useRouter();
  
  const [isClient, setIsClient] = useState(false);
  const [currentSetupStep, setCurrentSetupStep] = useState(SETUP_STEPS.COMPANY_DETAILS);

  const {
    company,
    setCompany,
    fetchCompany,
    getSetupCompletionPercentage,
    setupProgress,
    updateSetupProgress,
  } = useStore((state) => ({
    company: state.company,
    setCompany: state.setCompany,
    fetchCompany: state.fetchCompany,
    getSetupCompletionPercentage: state.getSetupCompletionPercentage,
    setupProgress: state.setupProgress,
    updateSetupProgress: state.updateSetupProgress,
  }));

  // --- HOOKS FOR MANAGING STATE AND SIDE EFFECTS ---

  useEffect(() => {
    // This hook simply flags that the component has mounted on the client.
    // It's essential for preventing hydration errors.
    setIsClient(true);
  }, []);

  // HOOK 1: Fetches company data if it's missing in the store.
  useEffect(() => {
    const loadCompanyData = async () => {
      const companyId = Cookies.get("company_id");
      if (companyId && !company) {
        try {
          await fetchCompany(companyId);
        } catch (error) {
          console.error("Error fetching company:", error);
          if (error.message.includes("404") || error.message.includes("not found")) {
            Cookies.remove("company_id", { path: "/" });
            Cookies.set("has_company", "false", { path: "/" });
            setCompany(null);
          }
        }
      }
    };
    loadCompanyData();
  }, [company, fetchCompany, setCompany]);

  // HOOK 2: Guards the route ONCE on initial page load.
  useEffect(() => {
    const companyId = Cookies.get("company_id");
    const hasCompany = Cookies.get("has_company") === "true";
    const setupStepCookie = Cookies.get("company_setup_step");

    // This is the "smart" redirect. It only fires if a user who has ALREADY
    // completed setup lands here by mistake (identified by the missing setupStepCookie).
    if (hasCompany && companyId && !setupStepCookie) {
      window.location.href = "/dashboard/employer";
    }
  }, []); // The empty array `[]` ensures this runs ONLY ONCE.

  // HOOK 3: Reads the current step from cookies after the client has loaded.
  useEffect(() => {
    const savedStep = Cookies.get("company_setup_step");
    if (savedStep) {
      setCurrentSetupStep(parseInt(savedStep, 10));
    }
  }, []);

  // HOOK 4: Keeps the cookie in sync with the current step state.
  useEffect(() => {
    if (isClient) {
      Cookies.set("company_setup_step", currentSetupStep.toString(), { 
        expires: 7,
        sameSite: "strict",
        path: "/" 
      });
    }
  }, [currentSetupStep, isClient]);


  // --- HANDLER FUNCTIONS ---

  const forceRedirectToDashboard = () => {
    // This function is called when setup is intentionally completed or skipped.
    Cookies.remove("company_setup_step", { path: "/" });
    Cookies.set("has_company", "true", {
      expires: 7,
      sameSite: "strict",
      path: "/",
    });
    window.location.href = "/dashboard/employer";
  };

  const goToNextStep = () => {
    switch (currentSetupStep) {
      case SETUP_STEPS.COMPANY_DETAILS: updateSetupProgress({ details: true }); break;
      case SETUP_STEPS.COMPANY_BENEFITS: updateSetupProgress({ benefits: true }); break;
      case SETUP_STEPS.COMPANY_LOGO: updateSetupProgress({ logo: true }); break;
      case SETUP_STEPS.COMPANY_IMAGES: updateSetupProgress({ images: true }); break;
      case SETUP_STEPS.COMPANY_TEAM: updateSetupProgress({ team: true }); break;
    }

    const nextStep = currentSetupStep + 1;
    if (nextStep > SETUP_STEPS.COMPANY_TEAM) {
      forceRedirectToDashboard();
    } else {
      setCurrentSetupStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentSetupStep > 1) {
      setCurrentSetupStep(currentSetupStep - 1);
    }
  };

  const skipToFinish = () => {
    const companyId = company?.id || Cookies.get("company_id");
    if (companyId && setupProgress.details) {
      forceRedirectToDashboard();
    } else {
      alert("Please complete your company details first.");
    }
  };

  const renderStepContent = () => {
    const companyId = company?.id || Cookies.get("company_id");
    
    // Fallback to details form if companyId is missing on subsequent steps
    if (currentSetupStep > SETUP_STEPS.COMPANY_DETAILS && !companyId) {
        setCurrentSetupStep(SETUP_STEPS.COMPANY_DETAILS);
        return <CompanyDetailsForm onComplete={goToNextStep} company={company} />;
    }

    switch (currentSetupStep) {
      case SETUP_STEPS.COMPANY_DETAILS: return <CompanyDetailsForm onComplete={goToNextStep} company={company} />;
      case SETUP_STEPS.COMPANY_BENEFITS: return <CompanyBenefitsForm onComplete={goToNextStep} onBack={goToPreviousStep} onSkip={skipToFinish} companyId={companyId} />;
      case SETUP_STEPS.COMPANY_LOGO: return <CompanyLogoUpload onComplete={goToNextStep} onBack={goToPreviousStep} onSkip={skipToFinish} companyId={companyId} />;
      case SETUP_STEPS.COMPANY_IMAGES: return <CompanyImagesUpload onComplete={goToNextStep} onBack={goToPreviousStep} onSkip={skipToFinish} companyId={companyId} />;
      case SETUP_STEPS.COMPANY_TEAM: return <CompanyTeamInvite onComplete={goToNextStep} onBack={goToPreviousStep} onSkip={skipToFinish} companyId={companyId} />;
      default: return <CompanyDetailsForm onComplete={goToNextStep} company={company} />;
    }
  };

  return (
    <div 
      className="min-h-screen relative transition-colors duration-200"
      style={{
        backgroundImage: `url('/images/homepage/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#0CCE68]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0CCE68] to-blue-500 rounded-2xl mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Build Your Company Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create a compelling company profile that attracts top tech talent
          </p>
          
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Setup Progress</span>
              {isClient && (
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-bold text-[#0CCE68]">{getSetupCompletionPercentage()}%</span>
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
              {isClient && (
                <div 
                  className="bg-gradient-to-r from-[#0CCE68] to-blue-500 h-3 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${getSetupCompletionPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center space-x-4 overflow-x-auto">
              {!isClient ? (
                Object.keys(stepConfig).map((key) => (
                  <div key={key} className="flex-1 min-w-0 opacity-50">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="text-center">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse hidden sm:block"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                Object.entries(stepConfig).map(([stepNumber, config]) => {
                  const stepNum = parseInt(stepNumber);
                  const Icon = config.icon;
                  const isActive = currentSetupStep === stepNum;
                  const progressKey = config.title.toLowerCase();
                  const isCompleted = setupProgress[progressKey] || (stepNum === 1 && setupProgress.details);
                  const isAccessible = stepNum === 1 || setupProgress.details;
                  
                  return (
                    <button key={stepNum} onClick={() => isAccessible && setCurrentSetupStep(stepNum)} disabled={!isAccessible}
                      className={`flex-1 min-w-0 transition-all duration-300 ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                            isCompleted ? `bg-gradient-to-r ${config.color} text-white shadow-lg` : isActive ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-110` : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                          {isActive && <div className="absolute inset-0 rounded-xl bg-white/30 animate-pulse"></div>}
                          {config.required && !isCompleted && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>}
                        </div>
                        <div className="text-center">
                          <h3 className={`text-sm font-medium transition-colors duration-300 ${isActive || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{config.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{config.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="p-6 lg:p-8">
            {isClient ? renderStepContent() : (
              <div className="flex justify-center items-center h-48">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div></div>
              <div className="flex items-center space-x-3">
                {isClient && currentSetupStep > SETUP_STEPS.COMPANY_DETAILS && setupProgress.details && (
                  <button onClick={skipToFinish} className="flex items-center space-x-2 text-[#0CCE68] hover:text-[#0BBE58] font-medium text-sm transition-colors duration-200">
                    <Target className="h-4 w-4" />
                    <span>Skip to Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🏢 Build a strong company presence to attract the best talent
          </p>
        </div>
      </div>
    </div>
  );
}