
// src/components/profile/sections/SkillsSection.jsx
'use client';
import { useState } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Award, Edit, Trash, Plus, Save, X, AlertCircle } from 'lucide-react';

export default function SkillsSection({ skills = [] }) {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'intermediate'
  });

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-gray-200 dark:bg-gray-700' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-200 dark:bg-blue-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-green-200 dark:bg-green-800' },
    { value: 'expert', label: 'Expert', color: 'bg-purple-200 dark:bg-purple-800' }
  ];

  const { addSkill, updateSkill, deleteSkill, fetchProfile } = useStore(state => ({
    addSkill: state.addSkill,
    updateSkill: state.updateSkill,
    deleteSkill: state.deleteSkill,
    fetchProfile: state.fetchProfile
  }));

  const resetForm = () => {
    setFormData({
      name: '',
      level: 'intermediate'
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name || '',
      level: skill.level || 'intermediate'
    });
    setEditingId(skill.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    setLoading(true);
    try {
      await deleteSkill(id);
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        await updateSkill(editingId, formData);
      } else {
        await addSkill(formData);
      }
      
      await fetchProfile();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getLevelColor = (level) => {
    const levelObj = skillLevels.find(l => l.value === level);
    return levelObj ? levelObj.color : 'bg-gray-200 dark:bg-gray-700';
  };

  const getLevelWidth = (level) => {
    switch (level) {
      case 'beginner': return '25%';
      case 'intermediate': return '50%';
      case 'advanced': return '75%';
      case 'expert': return '100%';
      default: return '50%';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Skills
        </h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingId ? 'Edit Skill' : 'Add Skill'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white text-sm font-medium rounded-md hover:bg-[#0BBE58] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="e.g. JavaScript, Project Management, Photoshop"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proficiency Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Skills List */}
      {skills.length === 0 && !showForm ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Award className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No skills added yet.</p>
          <p className="text-sm mt-1">Add your skills to showcase your abilities to potential employers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {skill.level_display || skill.level}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1 text-gray-400 hover:text-[#0CCE68] transition-colors"
                    aria-label="Edit skill"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    disabled={loading}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Delete skill"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Skill Level Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getLevelColor(skill.level)}`}
                  style={{ width: getLevelWidth(skill.level) }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}