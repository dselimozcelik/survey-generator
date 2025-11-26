import React, { useState, useEffect } from 'react';
import useSurveyStore from '../store/surveyStore';
import QuestionEditor from './QuestionEditor';

const SurveyEditor = ({ surveyId, onBack, onPreview }) => {
  const {
    surveys,
    updateSurvey,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    addQuestionGroup,
    updateQuestionGroup,
    deleteQuestionGroup,
    publishSurvey,
    unpublishSurvey,
  } = useSurveyStore();

  const survey = surveys.find((s) => s.id === surveyId);
  const [title, setTitle] = useState(survey?.title || '');
  const [description, setDescription] = useState(survey?.description || '');
  const [tags, setTags] = useState(survey?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    if (survey) {
      setTitle(survey.title);
      setDescription(survey.description);
      setTags(survey.tags || []);
    }
  }, [survey]);

  if (!survey) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-800 font-semibold">Survey not found</p>
        </div>
      </div>
    );
  }

  const handleSaveBasicInfo = () => {
    if (title.trim()) {
      updateSurvey(surveyId, { 
        title: title.trim(), 
        description: description.trim(),
        tags 
      });
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        const newTags = [...tags, trimmedTag];
        setTags(newTags);
        setTagInput('');
        updateSurvey(surveyId, { tags: newTags });
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    updateSurvey(surveyId, { tags: newTags });
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addQuestionGroup(surveyId, newGroupName.trim());
      setNewGroupName('');
      setShowGroupForm(false);
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group? Questions in this group will be ungrouped.')) {
      deleteQuestionGroup(surveyId, groupId);
    }
  };

  const handleAddQuestion = (questionData) => {
    if (editingQuestion) {
      updateQuestion(surveyId, editingQuestion.id, questionData);
      setEditingQuestion(null);
    } else {
      addQuestion(surveyId, questionData);
    }
    setShowQuestionForm(false);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(surveyId, questionId);
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'multiple-choice': '○ Single Choice',
      'multiple-select': '☑ Multiple Select',
      'dropdown': '▼ Dropdown',
      'open-ended': '✏ Open-ended',
      'rating-scale': '★ Rating Scale',
      'linear-scale': '━ Linear Scale',
      'date': '📅 Date',
      'time': '🕐 Time',
    };
    return labels[type] || type;
  };

  const handleMoveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < survey.questions.length) {
      reorderQuestions(surveyId, index, newIndex);
    }
  };

  const handlePublish = async () => {
    if (survey.published) {
      if (window.confirm('Are you sure you want to unpublish this survey from the mobile app?')) {
        await unpublishSurvey(surveyId);
      }
    } else {
      if (window.confirm('Are you sure you want to publish this survey to the mobile app?')) {
        await publishSurvey(surveyId);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to List
        </button>
        
        <div className="flex gap-3 items-center">
          {survey.published && (
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Published to Mobile App
            </span>
          )}
          <button
            onClick={handlePublish}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg ${
              survey.published
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-gray-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-green-500/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {survey.published ? 'Unpublish' : 'Send to Mobile App'}
          </button>
          <button
            onClick={onPreview}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        </div>
      </div>

      {/* Survey info card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Survey Information
          </h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Survey Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveBasicInfo}
              placeholder="Enter survey title"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveBasicInfo}
              placeholder="Enter survey description"
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
        </div>
      </div>

      {/* Questions section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Questions</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {survey.questions.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGroupForm(!showGroupForm)}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Group
            </button>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setShowQuestionForm(true);
              }}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </button>
          </div>
        </div>

        {/* Group Form */}
        {showGroupForm && (
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create Question Group</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                placeholder="Enter group name..."
                className="flex-1 px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAddGroup}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowGroupForm(false);
                  setNewGroupName('');
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
            {survey.question_groups && survey.question_groups.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Existing Groups:</p>
                <div className="flex flex-wrap gap-2">
                  {survey.question_groups.map((group) => (
                    <span
                      key={group.id}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-medium"
                    >
                      {group.name}
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showQuestionForm && (
          <div className="mb-8 border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50/50">
            <QuestionEditor
              question={editingQuestion}
              onSave={handleAddQuestion}
              onCancel={() => {
                setShowQuestionForm(false);
                setEditingQuestion(null);
              }}
            />
          </div>
        )}

        {survey.questions.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Click the button above to add questions to your survey</p>
          </div>
        ) : (
          <div className="space-y-4">
            {survey.questions.map((question, index) => (
              <div
                key={question.id}
                className="group border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-lg">
                        Question {index + 1}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-lg">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                      {question.required && (
                        <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-lg">
                          ★ Required
                        </span>
                      )}
                      {question.groupId && survey.question_groups && (
                        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-lg">
                          📁 {survey.question_groups.find(g => g.id === question.groupId)?.name || 'Group'}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {question.text}
                    </h3>
                    
                    {(question.type === 'multiple-choice' || question.type === 'multiple-select' || question.type === 'dropdown') && question.options && (
                      <ul className="space-y-2 mt-3">
                        {question.options.map((option, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                            <span className={`w-7 h-7 border-2 ${question.type === 'multiple-choice' ? 'border-blue-500 rounded-full' : 'border-emerald-500 rounded-lg'} flex items-center justify-center text-sm font-bold ${question.type === 'multiple-choice' ? 'text-blue-600' : 'text-emerald-600'} flex-shrink-0`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {(question.type === 'rating-scale' || question.type === 'linear-scale') && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700">
                            {question.minLabel || question.minScale} {question.minLabel && `(${question.minScale})`}
                          </span>
                          <span className="text-gray-500">
                            {question.type === 'rating-scale' ? '★'.repeat(question.maxScale - question.minScale + 1) : '━━━━━'}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {question.maxLabel || question.maxScale} {question.maxLabel && `(${question.maxScale})`}
                          </span>
                        </div>
                      </div>
                    )}

                    {question.type === 'open-ended' && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-sm italic">
                        Long text answer
                      </div>
                    )}

                    {(question.type === 'date' || question.type === 'time') && (
                      <div className="mt-3 p-4 bg-pink-50 rounded-xl border border-pink-200 text-gray-500 text-sm italic">
                        {question.type === 'date' ? 'Date picker' : 'Time picker'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleMoveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Move up"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(index, 'down')}
                      disabled={index === survey.questions.length - 1}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Move down"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyEditor;
