const BASE_URL = '/api';

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    return await res.json();
  },

  // Courses & Search
  getCourses: async () => {
    const res = await fetch(`${BASE_URL}/courses`);
    return await res.json();
  },

  getCourse: async (id) => {
    const res = await fetch(`${BASE_URL}/courses/${id}`);
    return await res.json();
  },

  search: async ({ q = '', type = 'all', level = 'all', goal = 'all', language = 'English' }) => {
    const params = new URLSearchParams({ q, type, level, goal, language });
    const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
    return await res.json();
  },

  getChannels: async () => {
    const res = await fetch(`${BASE_URL}/discovery/channels`);
    return await res.json();
  },

  // Video Details & Transcript
  getVideoDetails: async (courseId, videoId) => {
    const res = await fetch(`${BASE_URL}/youtube/details?courseId=${courseId || ''}&videoId=${videoId}`);
    return await res.json();
  },

  getTranscript: async (videoId, title = '') => {
    const res = await fetch(`${BASE_URL}/transcript/${videoId}?title=${encodeURIComponent(title)}`);
    return await res.json();
  },

  // AI Services
  tutorChat: async (payload) => {
    const res = await fetch(`${BASE_URL}/ai/tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  generateSummary: async (payload) => {
    const res = await fetch(`${BASE_URL}/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  generateQuiz: async (payload) => {
    const res = await fetch(`${BASE_URL}/ai/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  socraticDialogue: async (payload) => {
    const res = await fetch(`${BASE_URL}/ai/socratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  generatePath: async (payload) => {
    const res = await fetch(`${BASE_URL}/ai/path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // Smart Notes
  getNotes: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/notes?${params.toString()}`);
    return await res.json();
  },

  createNote: async (note) => {
    const res = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    return await res.json();
  },

  updateNote: async (id, updates) => {
    const res = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  deleteNote: async (id) => {
    const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Saved Paths
  getPaths: async () => {
    const res = await fetch(`${BASE_URL}/paths`);
    return await res.json();
  },

  savePath: async (pathData) => {
    const res = await fetch(`${BASE_URL}/paths`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pathData),
    });
    return await res.json();
  },

  deletePath: async (id) => {
    const res = await fetch(`${BASE_URL}/paths/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Test Results
  getTests: async () => {
    const res = await fetch(`${BASE_URL}/tests`);
    return await res.json();
  },

  submitTest: async (testData) => {
    const res = await fetch(`${BASE_URL}/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    return await res.json();
  },

  // Flashcards Mastery
  getFlashcardMastery: async () => {
    const res = await fetch(`${BASE_URL}/flashcards/mastery`);
    return await res.json();
  },

  updateFlashcard: async (cardId, status) => {
    const res = await fetch(`${BASE_URL}/flashcards/mastery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, status }),
    });
    return await res.json();
  },

  // Bookmarks
  getBookmarks: async () => {
    const res = await fetch(`${BASE_URL}/bookmarks`);
    return await res.json();
  },

  toggleBookmark: async (item) => {
    const res = await fetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return await res.json();
  },

  // Mastery
  getMastery: async () => {
    const res = await fetch(`${BASE_URL}/mastery`);
    return await res.json();
  },

  completeTopic: async (topicId, category) => {
    const res = await fetch(`${BASE_URL}/mastery/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId, category }),
    });
    return await res.json();
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${BASE_URL}/settings`);
    return await res.json();
  },

  updateSettings: async (settings) => {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return await res.json();
  },
};
