import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Loader2, PlusCircle } from 'lucide-react';
import { CreateExperience } from '@/app/action'; // Adjust the import path as needed
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'react-toastify';

interface WorkExperienceData {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  workSummary: string;
}

interface WorkExperienceProps {
  setActiveStep: (step: string) => void;
  setCompletedSteps: (steps: string[]) => void;
  completedSteps: string[];
}

interface FormState {
  message: string;
  error?: string;
}

const initialState: FormState = {
  message: "",
  error: undefined
};

const WorkExperience: React.FC<WorkExperienceProps> = ({ setActiveStep, setCompletedSteps, completedSteps }) => {
  const [experiences, setExperiences] = useState<WorkExperienceData[]>([
    { title: '', company: '', startDate: '', endDate: '', workSummary: '' }
  ]);
  const [createExperienceState, createExperienceAction] = useFormState(CreateExperience, initialState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (index: number, field: keyof WorkExperienceData, value: string) => {
    const newExperiences = [...experiences];
    if (field === 'endDate') {
      const startDate = new Date(newExperiences[index].startDate);
      const endDate = new Date(value);
      if (endDate < startDate) {
        toast.error("End date cannot be earlier than start date");
        return;
      }
    }
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  const addExperience = () => {
    setExperiences([...experiences, { title: '', company: '', startDate: '', endDate: '', workSummary: '' }]);
  };

  const removeExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    for (const experience of experiences) {
      const formData = new FormData();
      Object.entries(experience).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await createExperienceAction(formData);
    }

    setIsSubmitting(false);

    if (createExperienceState.message !== "Congratulations succesfuly added Education fill again to add more") {
      if (!completedSteps.includes('work-experience')) {
        setCompletedSteps([...completedSteps, 'work-experience']);
      }
      setActiveStep('education');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Work Experience</h2>
      {experiences.map((exp, index) => (
        <Card key={index} className="relative overflow-hidden transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`title-${index}`} className="text-sm font-medium text-gray-700">Job Title</Label>
                <Input
                  id={`title-${index}`}
                  placeholder="e.g., Software Engineer"
                  value={exp.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`company-${index}`} className="text-sm font-medium text-gray-700">Company</Label>
                <Input
                  id={`company-${index}`}
                  placeholder="e.g., Tech Solutions Inc."
                  value={exp.company}
                  onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`startDate-${index}`} className="text-sm font-medium text-gray-700">Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                    required
                    className="mt-1"
                    max={exp.endDate || undefined}
                  />
                </div>
                <div>
                  <Label htmlFor={`endDate-${index}`} className="text-sm font-medium text-gray-700">End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                    required
                    className="mt-1"
                    min={exp.startDate || undefined}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`workSummary-${index}`} className="text-sm font-medium text-gray-700">Work Summary</Label>
                <Textarea
                  id={`workSummary-${index}`}
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.workSummary}
                  onChange={(e) => handleInputChange(index, 'workSummary', e.target.value)}
                  required
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            {experiences.length > 1 && (
              <Button
                type="button"
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                aria-label="Remove experience"
              >
                <Trash2 size={18} />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        onClick={addExperience}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 flex items-center justify-center"
      >
        <PlusCircle size={18} className="mr-2" />
        Add Another Work Experience
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Save and Continue'
        )}
      </Button>
      {createExperienceState.message && (
        <div className={`mt-4 p-4 rounded-md ${createExperienceState.message === 'Congratulations successfully created education' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {createExperienceState.message}
        </div>
      )}
    </form>
  );
};

export default WorkExperience;