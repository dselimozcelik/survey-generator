import { useState, useEffect } from 'react';
import SurveyList from './components/SurveyList';
import SurveyEditor from './components/SurveyEditor';
import SurveyPreview from './components/SurveyPreview';
import CreateSurveyModal from './components/CreateSurveyModal';
import LoginForm from './components/LoginForm';
import useSurveyStore from './store/surveyStore';
import useAuthStore from './store/authStore';

function App() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'editor', 'preview'
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { setCurrentSurvey, loadSurveys } = useSurveyStore();
  const { user, loading: authLoading, initialize } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Load surveys when user is authenticated
  useEffect(() => {
    if (user) {
      loadSurveys();
    }
  }, [user, loadSurveys]);

  const handleSelectSurvey = (surveyId, view = 'editor') => {
    setSelectedSurveyId(surveyId);
    setCurrentSurvey(surveyId);
    setCurrentView(view);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSurveyId(null);
    setCurrentSurvey(null);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleSurveyCreated = (surveyId) => {
    setShowCreateModal(false);
    if (surveyId) {
      handleSelectSurvey(surveyId, 'editor');
    }
  };

  const handlePreview = (surveyId) => {
    setSelectedSurveyId(surveyId);
    setCurrentSurvey(surveyId);
    setCurrentView('preview');
  };

  const handleEditFromPreview = () => {
    setCurrentView('editor');
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {currentView === 'list' && (
          <SurveyList
            onSelectSurvey={handleSelectSurvey}
            onCreateNew={handleCreateNew}
            onPreview={handlePreview}
          />
        )}
        
        {currentView === 'editor' && (
          <SurveyEditor
            surveyId={selectedSurveyId}
            onBack={handleBackToList}
            onPreview={() => handlePreview(selectedSurveyId)}
          />
        )}
        
        {currentView === 'preview' && (
          <SurveyPreview
            surveyId={selectedSurveyId}
            onBack={handleBackToList}
            onEdit={handleEditFromPreview}
          />
        )}

        {showCreateModal && (
          <CreateSurveyModal
            onClose={() => setShowCreateModal(false)}
            onCreated={handleSurveyCreated}
          />
        )}
      </div>
    </div>
  );
}

export default App;
