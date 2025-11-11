import React, { useState } from 'react';
import useSurveyStore from '../store/surveyStore';

const SurveyPreview = ({ surveyId, onBack, onEdit }) => {
  const { surveys } = useSurveyStore();
  const survey = surveys.find((s) => s.id === surveyId);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!survey) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-800 font-semibold">Anket bulunamadı</p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMultipleSelectChange = (questionId, optionValue, checked) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionValue],
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((ans) => ans !== optionValue),
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Zorunlu soruları kontrol et
    const requiredQuestions = survey.questions.filter((q) => q.required);
    const missingAnswers = requiredQuestions.filter((q) => {
      if (!answers[q.id]) return true;
      if (Array.isArray(answers[q.id])) {
        return answers[q.id].length === 0;
      }
      return answers[q.id].trim() === '';
    });

    if (missingAnswers.length > 0) {
      alert('Lütfen tüm zorunlu soruları cevaplayın!');
      return;
    }

    setSubmitted(true);
    // Burada cevapları backend'e gönderebilirsiniz
    console.log('Anket Cevapları:', answers);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Teşekkürler!</h2>
          <p className="text-lg text-gray-600 mb-8">Anketimize katıldığınız için teşekkür ederiz. Cevaplarınız başarıyla kaydedildi.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              Yeniden Cevapla
            </button>
            <button
              onClick={onBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Geri Dön
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors px-4 py-2 hover:bg-blue-50 rounded-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Düzenle
        </button>
      </div>

      {/* Survey form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="flex items-center gap-4 text-sm text-blue-100 pt-4 border-t border-white/20">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {survey.questions.length} Soru
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ~{Math.ceil(survey.questions.length * 0.5)} dakika
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {survey.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {question.text}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Answer area */}
              <div className="pl-11">
                {question.type === 'multiple-choice' ? (
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all group"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          required={question.required}
                        />
                        <span className="flex-1 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : question.type === 'multiple-select' ? (
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all group"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={(answers[question.id] || []).includes(option)}
                          onChange={(e) => handleMultipleSelectChange(question.id, option, e.target.checked)}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="flex-1 text-gray-700 font-medium group-hover:text-emerald-700 transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                    {question.required && (
                      <p className="text-xs text-gray-500 italic mt-2">
                        * En az bir seçenek seçmelisiniz
                      </p>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Cevabınızı buraya yazın..."
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    required={question.required}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="sticky bottom-6 pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl"
          >
            Anketi Gönder
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyPreview;

