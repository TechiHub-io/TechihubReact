import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Loader2, Upload, Check, Trash2 } from 'lucide-react';

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

type AccordionStep = 'profile-picture' | 'personal-details' | 'resume-upload' | 'work-experience' | 'education';

type FormErrors = Partial<Record<keyof FormData, string>> & { form?: string };

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<AccordionStep[]>([]);

  useEffect(() => {
    updateProgress();
  }, [formData, completedSteps]);

  const updateProgress = () => {
    const totalSteps = 5;
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
      case 'resume-upload':
        if (!formData.resume) {
          newErrors.resume = 'Resume is required';
          isValid = false;
        }
        break;
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

  const handleSaveAndContinue = () => {
    if (validateStep(activeStep)) {
      if (!completedSteps.includes(activeStep)) {
        setCompletedSteps([...completedSteps, activeStep]);
      }
      const steps: AccordionStep[] = ['profile-picture', 'personal-details', 'resume-upload', 'work-experience', 'education'];
      const currentIndex = steps.indexOf(activeStep);
      if (currentIndex < steps.length - 1) {
        setActiveStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleSubmit = async () => {
    if (completedSteps.length === 5) {
      setIsLoading(true);
      console.log('Submitting form data:', formData);
      // Simulating API call
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 1000);
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
          className={`bg-blue-100 p-4 rounded-t-lg flex justify-between items-center ${!canOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!canOpen}
        >
          <span>{title}</span>
          {isCompleted && <Check className="text-green-500" />}
        </AccordionTrigger>
        <AccordionContent className="bg-white p-4 rounded-b-lg">
          {content}
          <Button onClick={handleSaveAndContinue} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
            Save and Continue
          </Button>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const renderProfilePicture = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p>Drag and drop your file here</p>
        <p>Or</p>
        <Button onClick={() => document.getElementById('profile-picture-upload')?.click()}>
          Browse file
        </Button>
        <input
          id="profile-picture-upload"
          type="file"
          className="hidden"
          onChange={(e) => handleFileUpload('profilePicture', e.target.files?.[0] || null)}
        />
      </div>
      {formData.profilePicture && (
        <p className="text-sm text-gray-500">{formData.profilePicture.name}</p>
      )}
      {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.personalDetails.firstName}
            onChange={(e) => handleInputChange('personalDetails', 'firstName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.personalDetails.lastName}
            onChange={(e) => handleInputChange('personalDetails', 'lastName', e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.personalDetails.address}
          onChange={(e) => handleInputChange('personalDetails', 'address', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.personalDetails.email}
          onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          value={formData.personalDetails.jobTitle}
          onChange={(e) => handleInputChange('personalDetails', 'jobTitle', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={formData.personalDetails.phoneNumber}
          onChange={(e) => handleInputChange('personalDetails', 'phoneNumber', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          value={formData.personalDetails.githubUrl}
          onChange={(e) => handleInputChange('personalDetails', 'githubUrl', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input
          id="linkedinUrl"
          value={formData.personalDetails.linkedinUrl}
          onChange={(e) => handleInputChange('personalDetails', 'linkedinUrl', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="about">About</Label>
        <Textarea
          id="about"
          value={formData.personalDetails.about}
          onChange={(e) => handleInputChange('personalDetails', 'about', e.target.value)}
        />
      </div>
      {errors.personalDetails && <p className="text-red-500 text-sm">{errors.personalDetails}</p>}
    </div>
  );

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
    <div className="space-y-4">
      {formData.workExperience.map((exp, index) => (
        <div key={index} className="space-y-2 border p-4 rounded relative">
          <Input
            placeholder="Title"
            value={exp.title}
            onChange={(e) => handleInputChange('workExperience', 'title', e.target.value, index)}
          />
          <Input
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleInputChange('workExperience', 'company', e.target.value, index)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) => handleInputChange('workExperience', 'startDate', e.target.value, index)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) => handleInputChange('workExperience', 'endDate', e.target.value, index)}
            />
          </div>
          <Textarea
            placeholder="Work Summary"
            value={exp.workSummary}
            onChange={(e) => handleInputChange('workExperience', 'workSummary', e.target.value, index)}
          />
          {formData.workExperience.length > 1 && (
           <Button
           onClick={() => removeExperience('workExperience', index)}
           className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
         >
           <Trash2 size={16} />
         </Button>
       )}
     </div>
   ))}
   <Button onClick={() => addExperience('workExperience')}>Add Work Experience</Button>
   {errors.workExperience && <p className="text-red-500 text-sm">{errors.workExperience}</p>}
 </div>
);

const renderEducation = () => (
 <div className="space-y-4">
   {formData.education.map((edu, index) => (
     <div key={index} className="space-y-2 border p-4 rounded relative">
       <Input
         placeholder="Course"
         value={edu.course}
         onChange={(e) => handleInputChange('education', 'course', e.target.value, index)}
       />
       <Input
         placeholder="School Name"
         value={edu.schoolName}
         onChange={(e) => handleInputChange('education', 'schoolName', e.target.value, index)}
       />
       <div className="grid grid-cols-2 gap-2">
         <Input
           type="date"
           placeholder="Start Date"
           value={edu.startDate}
           onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
         />
         <Input
           type="date"
           placeholder="End Date"
           value={edu.endDate}
           onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
         />
       </div>
       <Textarea
         placeholder="Summary"
         value={edu.summary}
         onChange={(e) => handleInputChange('education', 'summary', e.target.value, index)}
       />
       {formData.education.length > 1 && (
         <Button
           onClick={() => removeExperience('education', index)}
           className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
         >
           <Trash2 size={16} />
         </Button>
       )}
     </div>
   ))}
   <Button onClick={() => addExperience('education')}>Add Education</Button>
   {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
 </div>
);

const steps: AccordionStep[] = ['profile-picture', 'personal-details', 'resume-upload', 'work-experience', 'education'];

return (
 <div className={`w-full min-h-screen flex items-center justify-center bg-gray-100 ${theme === 'dark' ? 'dark' : ''} p-2 md:p-4`}>
   <div className="bg-white rounded-lg shadow-lg w-full max-w-full overflow-hidden">
     <div className="p-2 md:p-6">
       <h2 className="text-2xl font-bold mb-4">Get started</h2>
       <div className="mb-4 bg-gray-200 rounded-full h-2.5">
         <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
       </div>
       <div className="flex flex-col lg:flex-row gap-6">
         <div className="hidden lg:block lg:w-1/4">
           <h3 className="font-semibold mb-2">Personal Information</h3>
           <ul className="space-y-2 text-sm text-gray-600">
             <li className={isStepCompleted('profile-picture') ? 'text-green-500' : ''}>Upload profile picture</li>
             <li className={isStepCompleted('personal-details') ? 'text-green-500' : ''}>Personal details</li>
             <li className={isStepCompleted('resume-upload') ? 'text-green-500' : ''}>Upload resume</li>
           </ul>
           <h3 className="font-semibold mt-4 mb-2">Profile Information</h3>
           <ul className="space-y-2 text-sm text-gray-600">
             <li className={isStepCompleted('work-experience') ? 'text-green-500' : ''}>Work experience</li>
             <li className={isStepCompleted('education') ? 'text-green-500' : ''}>Education</li>
           </ul>
         </div>
         <div className="lg:w-3/4">
           <Accordion type="single" value={activeStep} onValueChange={(value) => setActiveStep(value as AccordionStep)}>
             {renderAccordionItem('profile-picture', 'Upload Profile Picture', renderProfilePicture())}
             {renderAccordionItem('personal-details', 'Personal Details', renderPersonalDetails())}
             {renderAccordionItem('resume-upload', 'Upload Resume', renderResumeUpload())}
             {renderAccordionItem('work-experience', 'Work Experience', renderWorkExperience())}
             {renderAccordionItem('education', 'Education', renderEducation())}
           </Accordion>
           <Button 
             onClick={handleSubmit} 
             disabled={isLoading || completedSteps.length !== steps.length} 
             className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
);
};

export default ProfileCompletionForm;