// src/components/profile/setup/SkillsForm.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Plus, Trash, Check, Award, Star, Zap, Code } from 'lucide-react';

export default function SkillsForm({ initialData, onSubmit, onSkip, loading, error, clearError }) {
  const [skills, setSkills] = useState([
    { name: '', level: 'intermediate' }
  ]);

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-gray-100 text-gray-700', icon: '📚' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-700', icon: '⚡' },
    { value: 'advanced', label: 'Advanced', color: 'bg-green-100 text-green-700', icon: '🚀' },
    { value: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-700', icon: '⭐' }
  ];

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'SQL',
    'AWS', 'Docker', 'Git', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Vue.js', 'Angular',
    'Machine Learning', 'Data Analysis', 'Project Management', 'UI/UX Design'
  ];

  // Update skills when initialData changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setSkills(initialData);
    }
  }, [initialData]);

  // Clear error when skills change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [skills, error, clearError]);

  // Handle skill input changes
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkills(updatedSkills);
  };

  // Add a new skill input
  const addSkill = () => {
    setSkills([...skills, { name: '', level: 'intermediate' }]);
  };

  // Remove a skill input
  const removeSkill = (index) => {
    if (skills.length > 1) {
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1);
      setSkills(updatedSkills);
    }
  };

  // Add popular skill
  const addPopularSkill = (skillName) => {
    // Check if skill already exists
    const existingSkill = skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase());
    if (!existingSkill) {
      // Find first empty skill slot or add new one
      const emptyIndex = skills.findIndex(skill => skill.name.trim() === '');
      if (emptyIndex !== -1) {
        handleSkillChange(emptyIndex, 'name', skillName);
      } else {
        setSkills([...skills, { name: skillName, level: 'intermediate' }]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out any empty skills
    const validSkills = skills.filter(skill => skill.name.trim() !== '');
    
    if (validSkills.length === 0) {
      alert('Please add at least one skill');
      return;
    }
    
    onSubmit(validSkills);
  };

  const getLevelIcon = (level) => {
    const levelData = skillLevels.find(l => l.value === level);
    return levelData ? levelData.icon : '⚡';
  };

  const getLevelColor = (level) => {
    const levelData = skillLevels.find(l => l.value === level);
    return levelData ? levelData.color : 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mb-4">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Showcase Your Skills
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add skills that highlight your expertise and attract employers
            </p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-[#0CCE68] hover:text-[#0BBE58] font-medium hover:underline transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center mb-6">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Popular Skills */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-blue-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Popular Skills
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click to quickly add popular skills to your profile
        </p>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addPopularSkill(skill)}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-[#0CCE68] hover:text-white hover:border-[#0CCE68] transition-all duration-200 transform hover:scale-105"
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0CCE68] to-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="e.g. JavaScript, Project Management, Photoshop"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200"
                  required={index === 0}
                />
              </div>
              
              <div className="w-40">
                <select
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0CCE68] focus:border-[#0CCE68] transition-all duration-200 appearance-none"
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.icon} {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {skill.name && (
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getLevelColor(skill.level)}`}>
                  {getLevelIcon(skill.level)}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                disabled={skills.length === 1}
                aria-label="Remove skill"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={addSkill}
          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-[#0CCE68] hover:text-[#0CCE68] transition-all duration-200 group"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
          Add Another Skill
        </button>
        
        {/* Skills Summary */}
        {skills.some(skill => skill.name.trim()) && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Your Skills Summary
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter(skill => skill.name.trim())
                .map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${getLevelColor(skill.level)}`}
                  >
                    {skill.name} {getLevelIcon(skill.level)}
                  </span>
                ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Clock className="animate-spin h-5 w-5 mr-2" />
                Completing profile...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                Complete My Profile
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Finish Later
          </button>
        </div>
      </form>
      
      {/* Motivation */}
      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-green-200 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🎯 <strong>Pro Tip:</strong> Profiles with skills get 3x more views from employers!
        </p>
      </div>
    </div>
  );
}