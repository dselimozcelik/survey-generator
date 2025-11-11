import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSurveyStore = create(
  persist(
    (set, get) => ({
      surveys: [],
      currentSurvey: null,

      // Yeni anket oluştur
      createSurvey: (title, description) => {
        const newSurvey = {
          id: Date.now().toString(),
          title,
          description,
          questions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          surveys: [...state.surveys, newSurvey],
          currentSurvey: newSurvey,
        }));
        return newSurvey.id;
      },

      // Anketi güncelle
      updateSurvey: (surveyId, updates) => {
        set((state) => ({
          surveys: state.surveys.map((survey) =>
            survey.id === surveyId
              ? { ...survey, ...updates, updatedAt: new Date().toISOString() }
              : survey
          ),
          currentSurvey:
            state.currentSurvey?.id === surveyId
              ? { ...state.currentSurvey, ...updates, updatedAt: new Date().toISOString() }
              : state.currentSurvey,
        }));
      },

      // Anketi sil
      deleteSurvey: (surveyId) => {
        set((state) => ({
          surveys: state.surveys.filter((survey) => survey.id !== surveyId),
          currentSurvey:
            state.currentSurvey?.id === surveyId ? null : state.currentSurvey,
        }));
      },

      // Mevcut anketi seç
      setCurrentSurvey: (surveyId) => {
        const survey = get().surveys.find((s) => s.id === surveyId);
        set({ currentSurvey: survey || null });
      },

      // Soru ekle
      addQuestion: (surveyId, question) => {
        const newQuestion = {
          id: Date.now().toString(),
          ...question,
        };
        set((state) => ({
          surveys: state.surveys.map((survey) =>
            survey.id === surveyId
              ? {
                  ...survey,
                  questions: [...survey.questions, newQuestion],
                  updatedAt: new Date().toISOString(),
                }
              : survey
          ),
          currentSurvey:
            state.currentSurvey?.id === surveyId
              ? {
                  ...state.currentSurvey,
                  questions: [...state.currentSurvey.questions, newQuestion],
                  updatedAt: new Date().toISOString(),
                }
              : state.currentSurvey,
        }));
      },

      // Soruyu güncelle
      updateQuestion: (surveyId, questionId, updates) => {
        set((state) => ({
          surveys: state.surveys.map((survey) =>
            survey.id === surveyId
              ? {
                  ...survey,
                  questions: survey.questions.map((q) =>
                    q.id === questionId ? { ...q, ...updates } : q
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : survey
          ),
          currentSurvey:
            state.currentSurvey?.id === surveyId
              ? {
                  ...state.currentSurvey,
                  questions: state.currentSurvey.questions.map((q) =>
                    q.id === questionId ? { ...q, ...updates } : q
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : state.currentSurvey,
        }));
      },

      // Soruyu sil
      deleteQuestion: (surveyId, questionId) => {
        set((state) => ({
          surveys: state.surveys.map((survey) =>
            survey.id === surveyId
              ? {
                  ...survey,
                  questions: survey.questions.filter((q) => q.id !== questionId),
                  updatedAt: new Date().toISOString(),
                }
              : survey
          ),
          currentSurvey:
            state.currentSurvey?.id === surveyId
              ? {
                  ...state.currentSurvey,
                  questions: state.currentSurvey.questions.filter(
                    (q) => q.id !== questionId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : state.currentSurvey,
        }));
      },

      // Soru sırasını değiştir
      reorderQuestions: (surveyId, startIndex, endIndex) => {
        set((state) => {
          const survey = state.surveys.find((s) => s.id === surveyId);
          if (!survey) return state;

          const newQuestions = Array.from(survey.questions);
          const [removed] = newQuestions.splice(startIndex, 1);
          newQuestions.splice(endIndex, 0, removed);

          return {
            surveys: state.surveys.map((s) =>
              s.id === surveyId
                ? { ...s, questions: newQuestions, updatedAt: new Date().toISOString() }
                : s
            ),
            currentSurvey:
              state.currentSurvey?.id === surveyId
                ? {
                    ...state.currentSurvey,
                    questions: newQuestions,
                    updatedAt: new Date().toISOString(),
                  }
                : state.currentSurvey,
          };
        });
      },
    }),
    {
      name: 'survey-storage',
    }
  )
);

export default useSurveyStore;

