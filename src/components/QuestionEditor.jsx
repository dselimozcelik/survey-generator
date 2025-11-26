import React, { useState, useEffect } from 'react';

const QuestionEditor = ({ question, onSave, onCancel }) => {
  const [questionType, setQuestionType] = useState(
    question?.type || 'multiple-choice'
  );
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [required, setRequired] = useState(question?.required || false);
  const [options, setOptions] = useState(
    question?.options || ['', '']
  );
  const [minScale, setMinScale] = useState(question?.minScale || 1);
  const [maxScale, setMaxScale] = useState(question?.maxScale || 5);
  const [minLabel, setMinLabel] = useState(question?.minLabel || '');
  const [maxLabel, setMaxLabel] = useState(question?.maxLabel || '');

  useEffect(() => {
    if (question) {
      setQuestionType(question.type);
      setQuestionText(question.text);
      setRequired(question.required || false);
      setOptions(question.options || ['', '']);
      setMinScale(question.minScale || 1);
      setMaxScale(question.maxScale || 5);
      setMinLabel(question.minLabel || '');
      setMaxLabel(question.maxLabel || '');
    }
  }, [question]);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      alert('Please enter the question text');
      return;
    }

    const baseQuestion = {
      type: questionType,
      text: questionText.trim(),
      required,
    };

    // Handle different question types
    if (questionType === 'multiple-choice' || questionType === 'multiple-select' || questionType === 'dropdown') {
      const validOptions = options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        alert('Please enter at least 2 options');
        return;
      }
      onSave({
        ...baseQuestion,
        options: validOptions,
      });
    } else if (questionType === 'rating-scale' || questionType === 'linear-scale') {
      if (maxScale <= minScale) {
        alert('Maximum scale must be greater than minimum scale');
        return;
      }
      onSave({
        ...baseQuestion,
        minScale,
        maxScale,
        minLabel: minLabel.trim(),
        maxLabel: maxLabel.trim(),
      });
    } else {
      // open-ended, date, time, email, phone, number, url
      onSave(baseQuestion);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Question Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Multiple Choice */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="multiple-choice"
              checked={questionType === 'multiple-choice'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'multiple-choice'
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <div className="text-2xl">○</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Single Choice</div>
              </div>
            </div>
          </label>

          {/* Multiple Select */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="multiple-select"
              checked={questionType === 'multiple-select'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'multiple-select'
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 hover:border-emerald-300'
            }`}>
              <div className="text-2xl">☑</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Multiple Select</div>
              </div>
            </div>
          </label>

          {/* Dropdown */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="dropdown"
              checked={questionType === 'dropdown'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'dropdown'
                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                : 'border-gray-200 hover:border-indigo-300'
            }`}>
              <div className="text-2xl">▼</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Dropdown</div>
              </div>
            </div>
          </label>

          {/* Open-ended */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="open-ended"
              checked={questionType === 'open-ended'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'open-ended'
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-gray-200 hover:border-purple-300'
            }`}>
              <div className="text-2xl">✏</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Open-ended</div>
              </div>
            </div>
          </label>

          {/* Rating Scale */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="rating-scale"
              checked={questionType === 'rating-scale'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'rating-scale'
                ? 'border-yellow-500 bg-yellow-50 shadow-sm'
                : 'border-gray-200 hover:border-yellow-300'
            }`}>
              <div className="text-2xl">★</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Rating Scale</div>
              </div>
            </div>
          </label>

          {/* Linear Scale */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="linear-scale"
              checked={questionType === 'linear-scale'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'linear-scale'
                ? 'border-orange-500 bg-orange-50 shadow-sm'
                : 'border-gray-200 hover:border-orange-300'
            }`}>
              <div className="text-2xl">━</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Linear Scale</div>
              </div>
            </div>
          </label>

          {/* Date */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="date"
              checked={questionType === 'date'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'date'
                ? 'border-pink-500 bg-pink-50 shadow-sm'
                : 'border-gray-200 hover:border-pink-300'
            }`}>
              <div className="text-2xl">📅</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Date</div>
              </div>
            </div>
          </label>

          {/* Time */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="time"
              checked={questionType === 'time'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-2 p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'time'
                ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                : 'border-gray-200 hover:border-cyan-300'
            }`}>
              <div className="text-2xl">🕐</div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-xs">Time</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Question Text
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question here..."
          rows="3"
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          required
        />
      </div>

      {/* Required checkbox */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-6 h-6 border-2 border-gray-300 rounded-lg peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-purple-600 peer-checked:border-transparent transition-all group-hover:border-blue-400 flex items-center justify-center">
              {required && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-gray-700 font-medium">Is this question required?</span>
        </label>
      </div>

      {/* Scale configuration for rating and linear scales */}
      {(questionType === 'rating-scale' || questionType === 'linear-scale') && (
        <div className="space-y-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Value
              </label>
              <input
                type="number"
                value={minScale}
                onChange={(e) => setMinScale(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Value
              </label>
              <input
                type="number"
                value={maxScale}
                onChange={(e) => setMaxScale(parseInt(e.target.value) || 5)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Label (Optional)
              </label>
              <input
                type="text"
                value={minLabel}
                onChange={(e) => setMinLabel(e.target.value)}
                placeholder="e.g., Poor"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Label (Optional)
              </label>
              <input
                type="text"
                value={maxLabel}
                onChange={(e) => setMaxLabel(e.target.value)}
                placeholder="e.g., Excellent"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Options for multiple choice, multiple select, and dropdown */}
      {(questionType === 'multiple-choice' || questionType === 'multiple-select' || questionType === 'dropdown') && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Options (At least 2)
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-3 items-center group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Remove option"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Option
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
        >
          {question ? '✓ Update' : '✓ Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default QuestionEditor;
