import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Loader2, Upload, Check, Trash2, Loader2Icon } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { CreateProfile, UploadProfilePicture } from '@/app/action';
import { toast, Bounce } from 'react-toastify';
import { useFormState } from 'react-dom';
import WorkExperience from './WorkExperience';
import Education from './Education';
import { useFormStatus } from 'react-dom';

type PersonalDetails = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  jobTitle: string;
  phoneNumber: string;
  githubUrl: string;
  linkedinUrl: string;
  about: string;
};

type WorkExperience = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  workSummary: string;
};

type Education = {
  course: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  summary: string;
};

type FormData = {
  profilePicture: File | null;
  personalDetails: PersonalDetails;
  resume: File | null;
  workExperience: WorkExperience[];
  education: Education[];
};

type AccordionStep = 'profile-picture' | 'personal-details' | 'work-experience' | 'education';

type FormErrors = Partial<Record<keyof FormData, string>> & { form?: string };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
          Saving...
        </>
      ) : (
        'Save Personal Details'
      )}
    </Button>
  );
}


const ProfileCompletionForm: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<AccordionStep>('profile-picture');
  const [formData, setFormData] = useState<FormData>({
    profilePicture: null,
    personalDetails: {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      jobTitle: '',
      phoneNumber: '',
      githubUrl: '',
      linkedinUrl: '',
      about: ''
    },
    resume: null,
    workExperience: [{ title: '', company: '', startDate: '', endDate: '', workSummary: '' }],
    education: [{ course: '', schoolName: '', startDate: '', endDate: '', summary: '' }]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<AccordionStep[]>([]);

  const formAction = async (prevState: any, formData: FormData) => {
   
    setCompletedSteps(prev => [...prev, 'personal-details']);
    setActiveStep('work-experience');
    // @ts-ignore
    return CreateProfile(prevState, formData);
  };

  const [createProfileState, createProfileAction] = useFormState(formAction, { message: '' });




  useEffect(() => {
    updateProgress();
  }, [formData, completedSteps]);
  

  useEffect(() => {
    if (createProfileState.message) {
      if (createProfileState.message.startsWith("Error:")) {
        toast.error(createProfileState.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce
        });
      } else {
        toast.success(createProfileState.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce
        });
        // Move to the next step after successful profile creation
        
      }
    }
  }, [createProfileState, activeStep]);

  const updateProgress = () => {
    const totalSteps = 4;
    const completedStepsCount = completedSteps.length;
    setProgress((completedStepsCount / totalSteps) * 100);
  };

  const handleInputChange = <T extends keyof FormData>(
    section: T,
    field: string,
    value: string,
    index?: number
  ) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      if (section === 'workExperience' || section === 'education') {
        if (index !== undefined) {
          //@ts-ignore
          newData[section] = [...prevData[section]] as FormData[T];
          (newData[section] as any[])[index] = { ...(newData[section] as any[])[index], [field]: value };
        }
      } else if (section === 'personalDetails') {
        newData.personalDetails = { ...prevData.personalDetails, [field]: value };
      }
      return newData;
    });
  };

  const handleFileUpload = (section: 'profilePicture' | 'resume', file: File | null) => {
    setFormData(prevData => ({ ...prevData, [section]: file }));
  };

  const addExperience = (section: 'workExperience' | 'education') => {
    setFormData(prevData => ({
      ...prevData,
      [section]: [
        ...prevData[section],
        section === 'workExperience'
          ? { title: '', company: '', startDate: '', endDate: '', workSummary: '' }
          : { course: '', schoolName: '', startDate: '', endDate: '', summary: '' }
      ]
    }));
  };

  const removeExperience = (section: 'workExperience' | 'education', index: number) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: AccordionStep): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    switch (step) {
      case 'profile-picture':
        if (!formData.profilePicture) {
          newErrors.profilePicture = 'Profile picture is required';
          isValid = false;
        }
        break;
      case 'personal-details':
        Object.entries(formData.personalDetails).forEach(([key, value]) => {
          if (!value) {
            newErrors.personalDetails = `${key} is required`;
            isValid = false;
          }
        });
        break;
      // case 'resume-upload':
      //   if (!formData.resume) {
      //     newErrors.resume = 'Resume is required';
      //     isValid = false;
      //   }
      //   break;
      case 'work-experience':
        if (formData.workExperience.some(exp => Object.values(exp).some(v => !v))) {
          newErrors.workExperience = 'All work experience fields are required';
          isValid = false;
        }
        break;
      case 'education':
        if (formData.education.some(edu => Object.values(edu).some(v => !v))) {
          newErrors.education = 'All education fields are required';
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProfilePictureUpload = (file: File | null) => {
    setFormData(prevData => ({ ...prevData, profilePicture: file }));
  };

  const handleSaveAndContinue = async () => {
    if (validateStep(activeStep)) {
      if (activeStep === 'profile-picture' && formData.profilePicture) {
        // Handle profile picture upload
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.profilePicture);
        
        try {
          const result = await UploadProfilePicture({} as any, uploadFormData);
          if (result.error) {
            toast.error(result.error, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce
            });
            setIsUploading(false);
            return;
          }
          toast.success(result.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce
          });
        } catch (error) {
          toast.error('Failed to upload profile picture', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce
          });
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      } else if (activeStep === 'personal-details') {
        return;
      }
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
      const steps: AccordionStep[] = ['profile-picture', 'personal-details', 'work-experience', 'education'];
      const currentIndex = steps.indexOf(activeStep);
      if (currentIndex < steps.length - 1) {
        setActiveStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleSubmit = async () => {
    if (completedSteps.length === 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push('/user-profile');
      }, 500);
    } else {
      setErrors({ form: 'Please complete all sections before submitting.' });
    }
  };

  const isStepCompleted = (step: AccordionStep) => completedSteps.includes(step);

  const renderAccordionItem = (step: AccordionStep, title: string, content: React.ReactNode) => {
    const isCompleted = isStepCompleted(step);
    const canOpen = step === 'profile-picture' || isStepCompleted(steps[steps.indexOf(step) - 1]);
  
    return (
      <AccordionItem value={step} className="mb-4">
        <AccordionTrigger 
          className={`bg-[#85C4FF] py-2 px-7 text-base font-bold flex justify-between items-center ${!canOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!canOpen}
        >
          <span>{title}</span>
        </AccordionTrigger>
        <AccordionContent className="bg-white p-4 rounded-b-lg">
          {content}
          {step === 'profile-picture' && (
            <Button disabled={isUploading} onClick={handleSaveAndContinue} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
             {
                isUploading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving</span>
              </> : <>
              Save and Continue
              </>
             }
             
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  };

  const renderProfilePicture = () => (
    <div className="space-y-4">
      <ProfilePictureUpload onFileUpload={handleProfilePictureUpload} isLoading={isUploading} />
      {formData.profilePicture && (
        <p className="text-sm text-gray-500">{formData.profilePicture.name}</p>
      )}
      {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
    </div>
  );


  const renderPersonalDetails = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Personal Details</h3>
        {/* @ts-ignore */}
        <form action={createProfileAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input
                id="firstname"
                name="firstname"
                defaultValue={formData.personalDetails.firstName}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input
                id="lastname"
                name="lastname"
                defaultValue={formData.personalDetails.lastName}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
          </div>
  
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={formData.personalDetails.email}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
          </div>
  
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={formData.personalDetails.address}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                defaultValue={formData.personalDetails.jobTitle}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={formData.personalDetails.phoneNumber}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="githubUrl" className="text-sm font-medium text-gray-700">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                defaultValue={formData.personalDetails.githubUrl}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                defaultValue={formData.personalDetails.linkedinUrl}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              />
            </div>
          </div>
  
          <div>
            <Label htmlFor="about" className="text-sm font-medium text-gray-700">About</Label>
            <Textarea
              id="about"
              name="about"
              defaultValue={formData.personalDetails.about}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
              rows={4}
            />
          </div>
  
          <SubmitButton />
        </form>
        {errors.personalDetails && (
          <p className="text-red-500 text-sm mt-2 bg-red-100 border border-red-400 rounded-md p-2">
            {errors.personalDetails}
          </p>
        )}
      </div>
    );
  };

  const renderResumeUpload = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p>Drag and drop your resume here</p>
        <p>Or</p>
        <Button onClick={() => document.getElementById('resume-upload')?.click()}>
          Browse file
        </Button>
        <input
          id="resume-upload"
          type="file"
          className="hidden"
          onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
        />
      </div>
      {formData.resume && (
        <p className="text-sm text-gray-500">{formData.resume.name}</p>
      )}
      {errors.resume && <p className="text-red-500 text-sm">{errors.resume}</p>}
    </div>
  );

  const renderWorkExperience = () => (
    <WorkExperience 
      setActiveStep={(step: string) => setActiveStep(step as AccordionStep)}
      setCompletedSteps={(steps: string[]) => setCompletedSteps(steps as AccordionStep[])}
      completedSteps={completedSteps}
    />
  );


const renderEducation = () => (
  <Education 
    setActiveStep={(step: string) => setActiveStep(step as AccordionStep)}
    setCompletedSteps={(steps: string[]) => setCompletedSteps(steps as AccordionStep[])}
    completedSteps={completedSteps}
  />
);


const steps: AccordionStep[] = ['profile-picture', 'personal-details', 'work-experience', 'education'];

return (
 <div className={`w-full min-h-screen py-8 lg:py-16 flex items-start justify-center bg-[#f2f5fc] ${theme === 'dark' ? 'dark' : ''}`}>
   <div className="  w-full max-w-full overflow-hidden">
     
     <div className="">
       
       <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 min-h-screen">
         <div className="hidden lg:block lg:w-1/4 lg:max-w-[320px] lg:mt-[7rem] lg:max-h-fit bg-[#fff] shadow-xl">
           <h3 className="font-semibold text-sm mb-2 py-[8px] px-[16px]">Personal Information</h3>
           <ul className="space-y-2 pl-5 w-full text-sm text-gray-600">
             <li className={isStepCompleted('profile-picture') ? 'text-green-500' : 'py-[8px] text-[#72838C]  px-[16px]'}>Upload profile picture</li>
             <li className={isStepCompleted('personal-details') ? 'text-green-500' : 'py-[8px] text-[#72838C] border-y-solid border-y-[1px]  px-[16px]'}>Personal details</li>
             {/* <li className={isStepCompleted('resume-upload') ? 'text-green-500' : ''}>Upload resume</li> */}
           </ul>
           <h3 className="font-semibold text-sm mt-4 mb-2 py-[8px] px-[16px]">Profile Information</h3>
           <ul className="space-y-2 pl-5 text-sm text-gray-600">
             <li className={isStepCompleted('work-experience') ? 'text-green-500' : 'py-[8px] text-[#72838C] px-[16px]'}>Work experience</li>
             <li className={isStepCompleted('education') ? 'text-green-500' : 'py-[8px] text-[#72838C] border-y-solid border-y-[1px] px-[16px]'}>Education</li>
           </ul>
         </div>
         <div className="lg:w-3/4 max-w-[1020px] ">
          <h2 className="text-[2rem] font-semibold text-center text-[#364187] lg:pb-[3.5rem] mb-4">Get started</h2>
          <div className="mb-4 bg-gray-200 rounded-full h-2.5 ">
            <div className="bg-[#85C4FF] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className='bg-[#fff] rounded-[8px] shadow-lg p-6 max-h-fit'>
            <h3 className='text-xl py-6 text-center'>Personal Information</h3>
            <Accordion type="single" value={activeStep} onValueChange={(value) => setActiveStep(value as AccordionStep)}>
              {renderAccordionItem('profile-picture', 'Upload Profile Picture', renderProfilePicture())}
              {renderAccordionItem('personal-details', 'Personal Details', renderPersonalDetails())}
              {/* {renderAccordionItem('resume-upload', 'Upload Resume', renderResumeUpload())} */}
              <h3 className='text-xl py-6 text-center'>Personal Information</h3>
              {renderAccordionItem('work-experience', 'Work Experience', renderWorkExperience())}
              {renderAccordionItem('education', 'Education', renderEducation())}
            </Accordion>
            
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || completedSteps.length !== steps.length} 
                  className="mt-4 w-full bg-[#0CCE68] hover:bg-[#0cce67b7] text-white font-bold py-2 px-4 rounded-[4px] lg:max-w-[250px]"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Finish
                </Button>
                {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}
                
            </div>
         </div>
       </div>
     </div>
   </div>
 </div>
);
};

export default ProfileCompletionForm;