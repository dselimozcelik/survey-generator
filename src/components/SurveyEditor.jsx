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
  } = useSurveyStore();

  const survey = surveys.find((s) => s.id === surveyId);
  const [title, setTitle] = useState(survey?.title || '');
  const [description, setDescription] = useState(survey?.description || '');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    if (survey) {
      setTitle(survey.title);
      setDescription(survey.description);
    }
  }, [survey]);

  if (!survey) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-800 font-semibold">Anket bulunamadı</p>
        </div>
      </div>
    );
  }

  const handleSaveBasicInfo = () => {
    if (title.trim()) {
      updateSurvey(surveyId, { title: title.trim(), description: description.trim() });
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
    if (window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      deleteQuestion(surveyId, questionId);
    }
  };

  const handleMoveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < survey.questions.length) {
      reorderQuestions(surveyId, index, newIndex);
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
          Geri Dön
        </button>
        
        <button
          onClick={onPreview}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-green-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Önizleme
        </button>
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
            Anket Bilgileri
          </h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anket Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveBasicInfo}
              placeholder="Anket başlığını girin"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveBasicInfo}
              placeholder="Anket açıklamasını girin"
              rows="3"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
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
            <h2 className="text-3xl font-bold text-gray-800">Sorular</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {survey.questions.length}
            </span>
          </div>
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
            Soru Ekle
          </button>
        </div>

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
            <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz soru eklenmedi</h3>
            <p className="text-gray-500 mb-4">Anketinize soru eklemek için yukarıdaki butona tıklayın</p>
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
                        Soru {index + 1}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-lg">
                        {question.type === 'multiple-choice' && '○ Tek Seçim'}
                        {question.type === 'multiple-select' && '☑ Çoklu Seçim'}
                        {question.type === 'open-ended' && '✏️ Açık Uçlu'}
                      </span>
                      {question.required && (
                        <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-lg">
                          ★ Zorunlu
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {question.text}
                    </h3>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <ul className="space-y-2 mt-3">
                        {question.options.map((option, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                            <span className="w-7 h-7 border-2 border-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {question.type === 'multiple-select' && question.options && (
                      <ul className="space-y-2 mt-3">
                        {question.options.map((option, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                            <span className="w-7 h-7 border-2 border-emerald-500 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-600 flex-shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleMoveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Yukarı taşı"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(index, 'down')}
                      disabled={index === survey.questions.length - 1}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Aşağı taşı"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      title="Düzenle"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Sil"
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
