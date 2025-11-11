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

  useEffect(() => {
    if (question) {
      setQuestionType(question.type);
      setQuestionText(question.text);
      setRequired(question.required || false);
      setOptions(question.options || ['', '']);
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
      alert('Lütfen soru metnini girin');
      return;
    }

    if (questionType === 'multiple-choice' || questionType === 'multiple-select') {
      const validOptions = options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        alert('Lütfen en az 2 seçenek girin');
        return;
      }

      onSave({
        type: questionType,
        text: questionText.trim(),
        required,
        options: validOptions,
      });
    } else {
      onSave({
        type: questionType,
        text: questionText.trim(),
        required,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Soru Tipi
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="multiple-choice"
              checked={questionType === 'multiple-choice'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-3 p-5 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'multiple-choice'
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                questionType === 'multiple-choice'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 bg-gray-50'
              }`}>
                {questionType === 'multiple-choice' ? (
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" strokeWidth={2} />
                  </svg>
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-sm">Tek Seçim</div>
                <div className="text-xs text-gray-500">Bir seçenek</div>
              </div>
            </div>
          </label>
          
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="multiple-select"
              checked={questionType === 'multiple-select'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-3 p-5 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'multiple-select'
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 hover:border-emerald-300'
            }`}>
              <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                questionType === 'multiple-select'
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300 bg-gray-50'
              }`}>
                {questionType === 'multiple-select' ? (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth={2} />
                  </svg>
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-sm">Çoklu Seçim</div>
                <div className="text-xs text-gray-500">Birden fazla</div>
              </div>
            </div>
          </label>
          
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="open-ended"
              checked={questionType === 'open-ended'}
              onChange={(e) => setQuestionType(e.target.value)}
              className="sr-only"
            />
            <div className={`flex flex-col items-center gap-3 p-5 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
              questionType === 'open-ended'
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-gray-200 hover:border-purple-300'
            }`}>
              <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                questionType === 'open-ended'
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300 bg-gray-50'
              }`}>
                {questionType === 'open-ended' ? (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 text-sm">Açık Uçlu</div>
                <div className="text-xs text-gray-500">Serbest metin</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Soru Metni
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Sorunuzu buraya yazın..."
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
          <span className="text-gray-700 font-medium">Bu soru zorunlu mu?</span>
        </label>
      </div>

      {/* Options for multiple choice and multiple select */}
      {(questionType === 'multiple-choice' || questionType === 'multiple-select') && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Seçenekler (En az 2 adet)
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
                  placeholder={`Seçenek ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Seçeneği kaldır"
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
            Seçenek Ekle
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
        >
          {question ? '✓ Güncelle' : '✓ Kaydet'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
        >
          İptal
        </button>
      </div>
    </form>
  );
};

export default QuestionEditor;
