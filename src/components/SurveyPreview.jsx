import React from 'react';
import useSurveyStore from '../store/surveyStore';

const SurveyPreview = ({ surveyId, onBack, onEdit }) => {
  const { surveys } = useSurveyStore();
  const survey = surveys.find((s) => s.id === surveyId);

  if (!survey) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-800 font-semibold">Survey not found</p>
        </div>
      </div>
    );
  }

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'multiple-choice': 'Single Choice',
      'multiple-select': 'Multiple Select',
      'dropdown': 'Dropdown',
      'open-ended': 'Open-ended',
      'rating-scale': 'Rating Scale',
      'linear-scale': 'Linear Scale',
      'date': 'Date',
      'time': 'Time',
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8">
      {/* Header */}
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
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors px-4 py-2 hover:bg-blue-50 rounded-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Survey
        </button>
      </div>

      {/* Preview Notice */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800 font-medium">
            Preview Mode - This is how your survey structure looks. This application is for survey design only, not for collecting responses.
          </p>
        </div>
      </div>

      {/* Survey Preview */}
      <div className="space-y-6">
        {/* Survey header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
              {survey.description && (
                <p className="text-blue-100 text-lg">{survey.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-blue-100 pt-4 border-t border-white/20 flex-wrap">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {survey.questions.length} Questions
            </span>
            {survey.tags && survey.tags.length > 0 && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {survey.tags.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {survey.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 p-6"
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {question.text}
                    </h3>
                    {question.required && (
                      <span className="text-red-500 font-bold">*</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    {question.groupId && survey.question_groups && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-md font-medium">
                        📁 {survey.question_groups.find(g => g.id === question.groupId)?.name || 'Group'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer preview area */}
              <div className="pl-11">
                {(question.type === 'multiple-choice' || question.type === 'multiple-select' || question.type === 'dropdown') && question.options ? (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      >
                        <div className={`w-5 h-5 ${question.type === 'multiple-choice' ? 'border-2 border-blue-500 rounded-full' : 'border-2 border-emerald-500 rounded'}`}></div>
                        <span className="flex-1 text-gray-700">
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : question.type === 'rating-scale' || question.type === 'linear-scale' ? (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
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
                ) : question.type === 'open-ended' ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-400 italic text-sm">Long text answer field</p>
                  </div>
                ) : question.type === 'date' ? (
                  <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
                    <p className="text-gray-400 italic text-sm">📅 Date picker field</p>
                  </div>
                ) : question.type === 'time' ? (
                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                    <p className="text-gray-400 italic text-sm">🕐 Time picker field</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-400 italic text-sm">Input field</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {survey.questions.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No questions have been added to this survey yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyPreview;

