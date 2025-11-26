import React, { useState } from 'react';
import useSurveyStore from '../store/surveyStore';
import useAuthStore from '../store/authStore';

const SurveyList = ({ onSelectSurvey, onCreateNew, onPreview }) => {
  const { surveys, deleteSurvey, publishSurvey, unpublishSurvey } = useSurveyStore();
  const { signOut, user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Get all unique tags from all surveys
  const allTags = [...new Set(surveys.flatMap(survey => survey.tags || []))];

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || (survey.tags && survey.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (e, surveyId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey(surveyId);
    }
  };

  const handlePublish = async (e, surveyId, isPublished) => {
    e.stopPropagation();
    if (isPublished) {
      if (window.confirm('Are you sure you want to unpublish this survey from the mobile app?')) {
        await unpublishSurvey(surveyId);
      }
    } else {
      if (window.confirm('Are you sure you want to publish this survey to the mobile app?')) {
        await publishSurvey(surveyId);
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await signOut();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            My Surveys
          </h1>
          <p className="text-gray-600 text-lg">View and manage all your surveys</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">Logged in as: {user.email}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <button
            onClick={onCreateNew}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 flex items-center gap-3 justify-center"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Survey
          </button>
        </div>
      </div>

      {/* Search and Filter bar */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search surveys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-600">Filter by tag:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                !selectedTag
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Survey grid */}
      {filteredSurveys.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {searchTerm || selectedTag ? 'No surveys found' : 'No surveys yet'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm || selectedTag
              ? 'No surveys match your search criteria. Try a different term or tag.'
              : 'Get started by creating your first survey and adding questions'}
          </p>
          {!searchTerm && !selectedTag && (
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Create My First Survey
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <div
              key={survey.id}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 hover:border-blue-300"
            >
              {/* Card gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-3xl transition-all duration-300"></div>
              
              <div className="relative">
                {/* Header with delete button */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    {survey.published && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Published
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, survey.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl"
                    title="Delete survey"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {survey.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
                  {survey.description || 'No description'}
                </p>

                {/* Tags */}
                {survey.tags && survey.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {survey.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-md text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {survey.questions.length} {survey.questions.length === 1 ? 'Question' : 'Questions'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(survey.updatedAt).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={(e) => handlePublish(e, survey.id, survey.published)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 shadow-sm ${
                        survey.published
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {survey.published ? 'Unpublish' : 'Send to Mobile App'}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreview(survey.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSurvey(survey.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
