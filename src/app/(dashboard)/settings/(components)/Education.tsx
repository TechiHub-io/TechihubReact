import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Loader2, PlusCircle, GraduationCap } from 'lucide-react';
import { CreateEducation } from '@/app/action'; // Adjust the import path as needed
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'react-toastify';

interface EducationData {
  course: string;
  school_name: string;
  startDate: string;
  endDate: string;
  summary: string;
}

interface EducationProps {
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

const Education: React.FC<EducationProps> = ({ setActiveStep, setCompletedSteps, completedSteps }) => {
  const [educations, setEducations] = useState<EducationData[]>([
    { course: '', school_name: '', startDate: '', endDate: '', summary: '' }
  ]);
  const [createEducationState, createEducationAction] = useFormState(CreateEducation, initialState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (index: number, field: keyof EducationData, value: string) => {
    const newEducations = [...educations];
    if (field === 'endDate') {
      const startDate = new Date(newEducations[index].startDate);
      const endDate = new Date(value);
      if (endDate < startDate) {
        toast.error("End date cannot be earlier than start date");
        return;
      }
    }
    newEducations[index][field] = value;
    setEducations(newEducations);
  };

  const addEducation = () => {
    setEducations([...educations, { course: '', school_name: '', startDate: '', endDate: '', summary: '' }]);
  };

  const removeEducation = (index: number) => {
    const newEducations = educations.filter((_, i) => i !== index);
    setEducations(newEducations);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    for (const education of educations) {
      const formData = new FormData();
      Object.entries(education).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await createEducationAction(formData);
    }

    setIsSubmitting(false);

    if (createEducationState.message !== "Congratulations succesfuly added Education fill again to add more") {
      if (!completedSteps.includes('education')) {
        setCompletedSteps([...completedSteps, 'education']);
      }
      setActiveStep('completion');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <GraduationCap className="mr-2" />
        Education
      </h2>
      {educations.map((edu, index) => (
        <Card key={index} className="relative overflow-hidden transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`course-${index}`} className="text-sm font-medium text-gray-700">Course/Degree</Label>
                <Input
                  id={`course-${index}`}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  value={edu.course}
                  onChange={(e) => handleInputChange(index, 'course', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`school-${index}`} className="text-sm font-medium text-gray-700">School/Institution</Label>
                <Input
                  id={`school-${index}`}
                  placeholder="e.g., University of Technology"
                  value={edu.school_name}
                  onChange={(e) => handleInputChange(index, 'school_name', e.target.value)}
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
                    value={edu.startDate}
                    onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                    required
                    className="mt-1"
                    max={edu.endDate || undefined}
                  />
                </div>
                <div>
                  <Label htmlFor={`endDate-${index}`} className="text-sm font-medium text-gray-700">End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                    required
                    className="mt-1"
                    min={edu.startDate || undefined}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`summary-${index}`} className="text-sm font-medium text-gray-700">Summary</Label>
                <Textarea
                  id={`summary-${index}`}
                  placeholder="Provide a brief summary of your studies, achievements, or relevant coursework..."
                  value={edu.summary}
                  onChange={(e) => handleInputChange(index, 'summary', e.target.value)}
                  required
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            {educations.length > 1 && (
              <Button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                aria-label="Remove education"
              >
                <Trash2 size={18} />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        onClick={addEducation}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 flex items-center justify-center"
      >
        <PlusCircle size={18} className="mr-2" />
        Add Another Education
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
      {createEducationState.message && (
        <div className={`mt-4 p-4 rounded-md ${createEducationState.message === 'Congratulations successfully created education' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {createEducationState.message}
        </div>
      )}
    </form>
  );
};

export default Education;