import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useSurveyStore = create((set, get) => ({
  surveys: [],
  currentSurvey: null,
  loading: false,
  error: null,

  // Load all surveys for current user
  loadSurveys: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ surveys: data || [], loading: false });
    } catch (error) {
      console.error('Error loading surveys:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Create new survey
  createSurvey: async (title, description, tags = []) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      const newSurvey = {
        user_id: user.id,
        title,
        description,
        tags,
        questions: [],
        question_groups: [],
        published: false,
        published_at: null,
      };

      const { data, error } = await supabase
        .from('surveys')
        .insert([newSurvey])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        surveys: [data, ...state.surveys],
        currentSurvey: data,
        loading: false,
      }));

      return data.id;
    } catch (error) {
      console.error('Error creating survey:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Update survey
  updateSurvey: async (surveyId, updates) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('surveys')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', surveyId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        surveys: state.surveys.map((survey) =>
          survey.id === surveyId ? data : survey
        ),
        currentSurvey:
          state.currentSurvey?.id === surveyId ? data : state.currentSurvey,
        loading: false,
      }));
    } catch (error) {
      console.error('Error updating survey:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Delete survey
  deleteSurvey: async (surveyId) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (error) throw error;

      set((state) => ({
        surveys: state.surveys.filter((survey) => survey.id !== surveyId),
        currentSurvey:
          state.currentSurvey?.id === surveyId ? null : state.currentSurvey,
        loading: false,
      }));
    } catch (error) {
      console.error('Error deleting survey:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Set current survey
  setCurrentSurvey: (surveyId) => {
    const survey = get().surveys.find((s) => s.id === surveyId);
    set({ currentSurvey: survey || null });
  },

  // Publish survey (send to mobile app)
  publishSurvey: async (surveyId) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('surveys')
        .update({
          published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', surveyId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        surveys: state.surveys.map((survey) =>
          survey.id === surveyId ? data : survey
        ),
        currentSurvey:
          state.currentSurvey?.id === surveyId ? data : state.currentSurvey,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Error publishing survey:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Unpublish survey
  unpublishSurvey: async (surveyId) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('surveys')
        .update({
          published: false,
          published_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', surveyId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        surveys: state.surveys.map((survey) =>
          survey.id === surveyId ? data : survey
        ),
        currentSurvey:
          state.currentSurvey?.id === surveyId ? data : state.currentSurvey,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error('Error unpublishing survey:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Add question
  addQuestion: async (surveyId, question) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const newQuestion = {
        id: Date.now().toString() + Math.random(),
        groupId: question.groupId || null,
        order: question.order || 0,
        ...question,
      };

      const updatedQuestions = [...survey.questions, newQuestion];

      await get().updateSurvey(surveyId, { questions: updatedQuestions });
    } catch (error) {
      console.error('Error adding question:', error);
      set({ error: error.message });
    }
  },

  // Update question
  updateQuestion: async (surveyId, questionId, updates) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const updatedQuestions = survey.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      );

      await get().updateSurvey(surveyId, { questions: updatedQuestions });
    } catch (error) {
      console.error('Error updating question:', error);
      set({ error: error.message });
    }
  },

  // Delete question
  deleteQuestion: async (surveyId, questionId) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const updatedQuestions = survey.questions.filter((q) => q.id !== questionId);

      await get().updateSurvey(surveyId, { questions: updatedQuestions });
    } catch (error) {
      console.error('Error deleting question:', error);
      set({ error: error.message });
    }
  },

  // Reorder questions
  reorderQuestions: async (surveyId, startIndex, endIndex) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const newQuestions = Array.from(survey.questions);
      const [removed] = newQuestions.splice(startIndex, 1);
      newQuestions.splice(endIndex, 0, removed);

      await get().updateSurvey(surveyId, { questions: newQuestions });
    } catch (error) {
      console.error('Error reordering questions:', error);
      set({ error: error.message });
    }
  },

  // Add question group
  addQuestionGroup: async (surveyId, groupName) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const newGroup = {
        id: Date.now().toString(),
        name: groupName,
        description: '',
        order: 0,
      };

      const updatedGroups = [...(survey.question_groups || []), newGroup];

      await get().updateSurvey(surveyId, { question_groups: updatedGroups });
      
      return newGroup.id;
    } catch (error) {
      console.error('Error adding question group:', error);
      set({ error: error.message });
      return null;
    }
  },

  // Update question group
  updateQuestionGroup: async (surveyId, groupId, updates) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const updatedGroups = (survey.question_groups || []).map((g) =>
        g.id === groupId ? { ...g, ...updates } : g
      );

      await get().updateSurvey(surveyId, { question_groups: updatedGroups });
    } catch (error) {
      console.error('Error updating question group:', error);
      set({ error: error.message });
    }
  },

  // Delete question group
  deleteQuestionGroup: async (surveyId, groupId) => {
    try {
      const survey = get().surveys.find((s) => s.id === surveyId);
      if (!survey) throw new Error('Survey not found');

      const updatedGroups = (survey.question_groups || []).filter((g) => g.id !== groupId);
      const updatedQuestions = survey.questions.map((q) =>
        q.groupId === groupId ? { ...q, groupId: null } : q
      );

      await get().updateSurvey(surveyId, {
        question_groups: updatedGroups,
        questions: updatedQuestions,
      });
    } catch (error) {
      console.error('Error deleting question group:', error);
      set({ error: error.message });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useSurveyStore;
