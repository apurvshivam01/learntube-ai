import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [mastery, setMastery] = useState({
    totalXp: 150,
    streakDays: 3,
    completedTopics: [],
    categoryScores: {},
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [settings, setSettings] = useState({
    preferredLanguage: 'English',
    tutorLanguage: 'English',
    tutorPersona: 'balanced',
    theme: 'dark',
    geminiApiKey: '',
    youtubeApiKey: '',
  });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadInitialData = async () => {
    try {
      const [mRes, bRes, sRes] = await Promise.all([
        api.getMastery(),
        api.getBookmarks(),
        api.getSettings(),
      ]);

      if (mRes.success) setMastery(mRes.mastery);
      if (bRes.success) setBookmarks(bRes.bookmarks);
      if (sRes.success) setSettings(sRes.settings);
    } catch (err) {
      console.warn('[AppContext] Failed to load data from backend:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const completeTopic = async (topicId, category) => {
    try {
      const res = await api.completeTopic(topicId, category);
      if (res.success) {
        setMastery(res.mastery);
        showToast('🎉 Topic marked complete! +100 XP gained!', 'success');
      }
    } catch (err) {
      showToast('Could not record topic completion', 'error');
    }
  };

  const toggleBookmark = async (item) => {
    try {
      const res = await api.toggleBookmark(item);
      if (res.success) {
        setBookmarks(res.bookmarks);
        showToast(
          res.bookmarked ? '🔖 Saved to your bookmarks!' : 'Removed from bookmarks',
          'info'
        );
      }
    } catch (err) {
      showToast('Failed to update bookmark', 'error');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const res = await api.updateSettings(newSettings);
      if (res.success) {
        setSettings(res.settings);
        showToast('Settings saved successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to save settings', 'error');
    }
  };

  const awardXp = (amount) => {
    setMastery((prev) => ({
      ...prev,
      totalXp: (prev.totalXp || 0) + amount,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        mastery,
        bookmarks,
        settings,
        loading,
        showToast,
        completeTopic,
        toggleBookmark,
        updateSettings,
        awardXp,
        refreshData: loadInitialData,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 animate-bounce bg-slate-900 border-slate-700 text-slate-100">
          <span className="text-xl">
            {toastMessage.type === 'success' ? '✨' : toastMessage.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="text-sm font-medium">{toastMessage.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
