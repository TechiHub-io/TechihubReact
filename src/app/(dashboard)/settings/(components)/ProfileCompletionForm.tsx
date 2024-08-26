// ProfileCompletionForm.tsx
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { CreateEducation, CreateExperience, CreateProfile, UploadResume } from "@/app/action";
import { z } from 'zod';
import { useForm, useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown, ChevronUp, Circle, Plus } from 'lucide-react';

// Zod schema for form validation
const formSchema = z.object({
  profilePicture: z.instanceof(File).optional(),
  personalDetails: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    yearsOfExperience: z.number().min(0, "Years of experience must be non-negative"),
    jobLevel: z.enum(["entry", "mid", "senior"]),
    country: z.string().min(1, "Country is required"),
  }),
  resume: z.instanceof(File).optional(),
  portfolio: z.instanceof(File).optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less"),
  workExperience: z.array(z.object({
    company: z.string().min(1, "Company name is required"),
    durationFrom: z.string().min(1, "Start date is required"),
    durationTo: z.string().min(1, "End date is required"),
    role: z.string().min(1, "Role is required"),
    location: z.string().min(1, "Location is required"),
    link: z.string().url("Invalid URL").optional(),
  })),
  topSkills: z.array(z.string()).min(1, "At least one skill is required"),
});

const initialState = {
  message: ""
}

type FormData = z.infer<typeof formSchema>;

const subsections = {
  personalInformation: ['uploadProfilePicture', 'personalDetails', 'uploadResume', 'uploadPortfolio'],
  profileInformation: ['bio', 'workExperience', 'topSkills']
};

const ProfileCompletionForm: React.FC = () => {
  const [stateProfile, handleProfile] = useFormState(CreateProfile, initialState);
  const [stateEducation, handleEducation] = useFormState(CreateEducation, initialState);
  const [stateExperience, handleExperience] = useFormState(CreateExperience, initialState);
  const [stateResume, handleResume] = useFormState(UploadResume, initialState);

  const [activeSection, setActiveSection] = useState<string | null>('uploadProfilePicture');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workExperience: [{ company: '', durationFrom: '', durationTo: '', role: '', link: '', location: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

 

  const onSubmit = async (data: Partial<FormData>) => {
    if (!activeSection) return;
    console.log("this is", data)
    try {
      // Make API call for the specific subsection
      await submitSubsectionData(activeSection, data);

      // Mark the section as completed
      if (!completedSections.includes(activeSection)) {
        setCompletedSections([...completedSections, activeSection]);
      }

      // Move to the next section
      const allSections = [...subsections.personalInformation, ...subsections.profileInformation];
      const currentIndex = allSections.indexOf(activeSection);
      if (currentIndex < allSections.length - 1) {
        setActiveSection(allSections[currentIndex + 1]);
      } else {
        setActiveSection(null); // Close accordion if it's the last section
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const submitSubsectionData = async (subsection: string, data: Partial<FormData>) => {
    // Simulate API call
    console.log(`Submitting data for ${subsection}:`, data);
    // In a real application, you would make an actual API call here
    // For example:
    // await api.updateProfileSubsection(subsection, data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const toggleAccordion = (title: string) => {
    setActiveSection(prevSection => prevSection === title ? null : title);
  };

  const renderAccordion = (title: string, content: React.ReactNode) => (
    <div className="mb-4 border rounded">
      <button
        className={`w-full text-left p-4 flex justify-between items-center ${activeSection === title ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => toggleAccordion(title)}
      >
        {title}
        {activeSection === title ? <ChevronUp /> : <ChevronDown />}
      </button>
      {activeSection === title && (
        <div className="p-4">
          {content}
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Save & Continue
          </button>
        </div>
      )}
    </div>
  );

  const renderSideMenuItem = (title: string, subsection: string) => (
    <li className="flex items-center mb-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
        completedSections.includes(subsection) ? 'bg-green-500' : 'border border-gray-300'
      }`}>
        {completedSections.includes(subsection) ? (
          <Check className="text-white" size={16} />
        ) : (
          <Circle className="text-gray-300" size={16} />
        )}
      </div>
      <span className={completedSections.includes(subsection) ? 'text-green-500' : ''}>
        {title}
      </span>
    </li>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Side Menu */}
      <div className="w-1/4 min-w-[200px] bg-white p-4 shadow-md">
        <h2 className="font-bold mb-4 text-lg text-gray-700">Personal Information</h2>
        <ul className="mb-6">
          {renderSideMenuItem('Upload profile picture', 'uploadProfilePicture')}
          {renderSideMenuItem('Personal details', 'personalDetails')}
          {renderSideMenuItem('Upload resume', 'uploadResume')}
          {renderSideMenuItem('Upload portfolio/github', 'uploadPortfolio')}
        </ul>
        <h2 className="font-bold mb-4 text-lg text-gray-700">Profile Information</h2>
        <ul>
          {renderSideMenuItem('Bio', 'bio')}
          {renderSideMenuItem('Work experience', 'workExperience')}
          {renderSideMenuItem('Top skills', 'topSkills')}
        </ul>
      </div>

      {/* Main Form */}
      <div className="w-3/4 md:min-w-[595px] xl:min-w-[738px] p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Complete Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderAccordion('Upload Profile Picture', (
            <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
              <div className="mb-4">
                <span className="text-6xl text-gray-400">S</span>
              </div>
              <p className="text-gray-600">Drag and drop your file</p>
              <p className="text-gray-400 mb-2">Or</p>
              <button className="mt-2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">Browse file</button>
              <input type="file" {...register('profilePicture')} className="hidden" />
            </div>
          ))}

          {renderAccordion('Personal Details', (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input {...register('personalDetails.firstName')} placeholder="First Name" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input {...register('personalDetails.lastName')} placeholder="Last Name" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input {...register('personalDetails.jobTitle')} placeholder="Job Title" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input type="number" {...register('personalDetails.yearsOfExperience', { valueAsNumber: true })} placeholder="Years of Experience" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <select {...register('personalDetails.jobLevel')} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select job level</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
              <select {...register('personalDetails.country')} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select country</option>
                {/* Add more country options */}
              </select>
            </div>
          ))}

          {renderAccordion('Upload Resume', (
            <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
              <div className="mb-4">
                <span className="text-6xl text-gray-400">S</span>
              </div>
              <p className="text-gray-600">Drag and drop your resume</p>
              <p className="text-gray-400 mb-2">Or</p>
              <button className="mt-2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">Browse file</button>
              <input type="file" {...register('resume')} className="hidden" accept=".pdf,.doc,.docx" />
            </div>
          ))}

          {renderAccordion('Bio', (
            <div>
              <textarea
                {...register('bio')}
                placeholder="Tell us about yourself..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              ></textarea>
              {errors.bio && <p className="text-red-500 mt-1">{errors.bio.message}</p>}
            </div>
          ))}

          {renderAccordion('Work Experience', (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                  <input
                    {...register(`workExperience.${index}.company` as const)}
                    placeholder="Company"
                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex mb-2 space-x-2">
                    <input
                      {...register(`workExperience.${index}.durationFrom` as const)}
                      placeholder="From"
                      type="date"
                      className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      {...register(`workExperience.${index}.durationTo` as const)}
                      placeholder="To"
                      type="date"
                      className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    {...register(`workExperience.${index}.role` as const)}
                    placeholder="Role"
                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    {...register(`workExperience.${index}.link` as const)}
                    placeholder="Link to portfolio/github"
                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    {...register(`workExperience.${index}.location` as const)}
                    placeholder="Location"
                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ company: '', durationFrom: '', durationTo: '', role: '', link: '', location: '' })}
                className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <Plus size={16} className="mr-1" /> Add more work experience
              </button>
            </div>
          ))}

          {renderAccordion('Top Skills', (
            <div>
              <input {...register('topSkills')} placeholder="Top skills (comma-separated)" className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4 text-gray-400">S</span>
                <div>
                  <p className="text-gray-700 font-semibold">Salary expectation</p>
                  <div className="flex items-center space-x-2">
                    <input type="text" placeholder="Min" className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input type="text" placeholder="Max" className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionForm;