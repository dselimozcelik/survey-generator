import React, { useState } from 'react';
import useSurveyStore from '../store/surveyStore';

const CreateSurveyModal = ({ onClose, onCreated }) => {
  const { createSurvey } = useSurveyStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a survey title');
      return;
    }

    setIsSubmitting(true);
    try {
      const surveyId = await createSurvey(title.trim(), description.trim(), tags);
      onCreated(surveyId);
    } catch (error) {
      alert('Failed to create survey. Please try again.');
      console.error('Create survey error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-white/20 animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Survey</h2>
          <p className="text-gray-600">Start by entering your survey's basic information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Survey Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Customer Satisfaction Survey"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description of your survey..."
              rows="3"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-all text-sm"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Creating...' : 'Create Survey'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSurveyModal;
