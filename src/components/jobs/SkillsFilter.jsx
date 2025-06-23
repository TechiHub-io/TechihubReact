// src/components/jobs/SkillsFilter.jsx
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

// Popular tech skills
const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis',
  'Vue.js', 'Angular', 'Django', 'Flask', 'Express.js', 'Next.js',
  'GraphQL', 'REST API', 'Git', 'Linux', 'DevOps', 'Machine Learning',
  'Data Science', 'AI', 'Blockchain', 'React Native', 'Flutter', 'Swift'
];

export default function SkillsFilter({ selectedSkills = [], onSkillsChange }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input and exclude already selected
  const suggestions = POPULAR_SKILLS.filter(skill => 
    skill.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedSkills.includes(skill)
  ).slice(0, 8); // Limit to 8 suggestions

  const handleAddSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddSkill(inputValue.trim());
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Field */}
      <div className="relative">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            placeholder="Add skills (e.g., React, Python)"
            className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => handleAddSkill(inputValue.trim())}
              className="ml-2 p-1 text-[#0CCE68] hover:bg-[#0CCE68] hover:bg-opacity-10 rounded"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {skill}
              </button>
            ))}
            {inputValue && !suggestions.includes(inputValue.trim()) && inputValue.trim() && (
              <button
                type="button"
                onClick={() => handleAddSkill(inputValue.trim())}
                className="w-full px-3 py-2 text-left text-sm text-[#0CCE68] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-600"
              >
                Add "{inputValue.trim()}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <div
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#0CCE68] bg-opacity-10 text-[#fff] border border-[#0CCE68] border-opacity-20"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Popular Skills */}
      {selectedSkills.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.slice(0, 6).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-[#0CCE68] hover:bg-opacity-10 hover:text-[#fff] transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}