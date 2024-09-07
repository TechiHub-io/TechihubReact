import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Loader2, Upload } from 'lucide-react';

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

  const handleInputChange = <T extends keyof FormData>(
    section: T,
    field: string,
    value: string,
    index?: number
  ) => {
    setFormData(prevData => {
      if (section === 'workExperience' || section === 'education') {
        if (index === undefined) {
          console.error('Index is required for arrays');
          return prevData;
        }
        const newArray = [...prevData[section]];
        newArray[index] = { ...newArray[index], [field]: value } as any;
        return { ...prevData, [section]: newArray };
      } else if (section === 'personalDetails') {
        return {
          ...prevData,
          [section]: { ...prevData[section], [field]: value }
        };
      }
      return prevData;
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

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log(formData);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  const renderProfilePicture = () => (
    <AccordionItem value="profile-picture">
      <AccordionTrigger>Upload Profile Picture</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800">
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
          <Button onClick={() => setActiveStep('personal-details')}>Next</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderPersonalDetails = () => (
    <AccordionItem value="personal-details">
      <AccordionTrigger>Personal Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
          </div>
         

          <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          
          <div>
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.personalDetails.about}
              onChange={(e) => handleInputChange('personalDetails', 'about', e.target.value)}
            />
          </div>
          <Button onClick={() => setActiveStep('resume-upload')}>Next</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderResumeUpload = () => (
    <AccordionItem value="resume-upload">
      <AccordionTrigger>Upload Resume</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800">
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
          <Button onClick={() => setActiveStep('work-experience')}>Next</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderWorkExperience = () => (
    <AccordionItem value="work-experience">
      <AccordionTrigger>Work Experience</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800">
          {formData.workExperience.map((exp, index) => (
            <div key={index} className="space-y-2 border p-4 rounded">
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
            </div>
          ))}
          <Button onClick={() => addExperience('workExperience')}>Add Work Experience</Button>
          <Button onClick={() => setActiveStep('education')}>Next</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const renderEducation = () => (
    <AccordionItem value="education">
      <AccordionTrigger>Education</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4 bg-white dark:bg-gray-800">
          {formData.education.map((edu, index) => (
            <div key={index} className="space-y-2 border p-4 rounded">
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
            </div>
          ))}
          <Button onClick={() => addExperience('education')}>Add Education</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className={` w-full z-50 flex items-center justify-center bg-black bg-opacity-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <Accordion type="single" value={activeStep} onValueChange={(value) => setActiveStep(value as AccordionStep)}>
            {renderProfilePicture()}
            {renderPersonalDetails()}
            {renderResumeUpload()}
            {renderWorkExperience()}
            {renderEducation()}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionForm;