import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.resolve('data');
const DB_FILE = path.join(DATA_DIR, 'learntube_db.json');

// Initial schema structure
const defaultState = {
  courses: [],
  learningPaths: [],
  notes: [],
  quizzes: [],
  testResults: [],
  flashcardMastery: {}, // { [cardId]: { status: 'know'|'dont_know', repetitions: 1, lastReviewed: string } }
  bookmarks: [],
  history: [], // { videoId, topicId, watchedAt, progressPercent }
  mastery: {
    totalXp: 150,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedTopics: [],
    categoryScores: {
      'Operating Systems': 80,
      'Data Structures': 75,
      'DBMS': 65,
      'Computer Networks': 70,
      'Machine Learning': 60,
    },
  },
  settings: {
    preferredLanguage: 'English',
    tutorLanguage: 'English',
    tutorPersona: 'balanced', // 'balanced' | 'strict_professor' | 'socratic_mentor' | 'friendly_peer' | 'eli5'
    theme: 'dark',
    autoPlayNext: true,
    geminiApiKey: '',
    youtubeApiKey: '',
  },
};

let dbState = { ...defaultState };

// Initialize database directory and file
export const initDB = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dbState = { ...defaultState, ...parsed };
      console.log(`[Database] Loaded persistent data store from ${DB_FILE}`);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf-8');
      console.log(`[Database] Initialized new persistent store at ${DB_FILE}`);
    }
  } catch (err) {
    console.warn('[Database] Filesystem persistence warning:', err.message);
    dbState = { ...defaultState };
  }
};

// Persist current state to JSON file
const persist = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Persistence error:', err.message);
  }
};

export const db = {
  get: () => dbState,

  update: (updater) => {
    dbState = updater(dbState);
    persist();
    return dbState;
  },

  // Notes operations
  getNotes: (filters = {}) => {
    let notes = [...(dbState.notes || [])];
    if (filters.topicId) notes = notes.filter((n) => n.topicId === filters.topicId);
    if (filters.videoId) notes = notes.filter((n) => n.videoId === filters.videoId);
    if (filters.pinned) notes = notes.filter((n) => n.isPinned);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return notes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  createNote: (noteData) => {
    const newNote = {
      id: 'note_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      topicId: noteData.topicId || 'general',
      topicTitle: noteData.topicTitle || 'General Study',
      videoId: noteData.videoId || '',
      videoTitle: noteData.videoTitle || '',
      timestampSeconds: noteData.timestampSeconds || 0,
      tags: noteData.tags || ['Study'],
      isPinned: !!noteData.isPinned,
      isAiGenerated: !!noteData.isAiGenerated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbState.notes = [newNote, ...(dbState.notes || [])];
    persist();
    return newNote;
  },

  updateNote: (id, updates) => {
    const idx = (dbState.notes || []).findIndex((n) => n.id === id);
    if (idx === -1) return null;
    dbState.notes[idx] = {
      ...dbState.notes[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    persist();
    return dbState.notes[idx];
  },

  deleteNote: (id) => {
    const initialLen = (dbState.notes || []).length;
    dbState.notes = (dbState.notes || []).filter((n) => n.id !== id);
    persist();
    return (dbState.notes || []).length < initialLen;
  },

  // Learning Paths
  getPaths: () => dbState.learningPaths || [],

  savePath: (pathData) => {
    const newPath = {
      id: pathData.id || 'path_' + Date.now().toString(36),
      title: pathData.title,
      subject: pathData.subject,
      level: pathData.level || 'Intermediate',
      goal: pathData.goal || 'Complete Course',
      durationHours: pathData.durationHours || 20,
      description: pathData.description || '',
      stages: pathData.stages || [],
      progress: pathData.progress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const existingIndex = (dbState.learningPaths || []).findIndex((p) => p.id === newPath.id);
    if (existingIndex >= 0) {
      dbState.learningPaths[existingIndex] = { ...dbState.learningPaths[existingIndex], ...newPath };
    } else {
      dbState.learningPaths = [newPath, ...(dbState.learningPaths || [])];
    }
    persist();
    return newPath;
  },

  deletePath: (id) => {
    dbState.learningPaths = (dbState.learningPaths || []).filter((p) => p.id !== id);
    persist();
    return true;
  },

  // Test Results
  saveTestResult: (resultData) => {
    const result = {
      id: 'test_' + Date.now().toString(36),
      topicId: resultData.topicId,
      topicTitle: resultData.topicTitle,
      score: resultData.score,
      totalQuestions: resultData.totalQuestions,
      accuracy: Math.round((resultData.score / (resultData.totalQuestions || 1)) * 100),
      timeSpentSeconds: resultData.timeSpentSeconds || 0,
      weakTopics: resultData.weakTopics || [],
      strongTopics: resultData.strongTopics || [],
      answers: resultData.answers || [],
      aiFeedback: resultData.aiFeedback || '',
      createdAt: new Date().toISOString(),
    };
    dbState.testResults = [result, ...(dbState.testResults || [])];

    // Award XP
    const xpEarned = result.score * 20 + 50;
    dbState.mastery.totalXp = (dbState.mastery.totalXp || 0) + xpEarned;

    persist();
    return { result, xpEarned };
  },

  getTestResults: () => dbState.testResults || [],

  // Flashcards mastery
  updateFlashcard: (cardId, status) => {
    if (!dbState.flashcardMastery) dbState.flashcardMastery = {};
    const existing = dbState.flashcardMastery[cardId] || { repetitions: 0 };
    dbState.flashcardMastery[cardId] = {
      status, // 'know' or 'dont_know'
      repetitions: existing.repetitions + 1,
      lastReviewed: new Date().toISOString(),
    };
    persist();
    return dbState.flashcardMastery[cardId];
  },

  getFlashcardMastery: () => dbState.flashcardMastery || {},

  // Bookmarks
  getBookmarks: () => dbState.bookmarks || [],

  toggleBookmark: (item) => {
    if (!dbState.bookmarks) dbState.bookmarks = [];
    const idx = dbState.bookmarks.findIndex((b) => b.id === item.id);
    let bookmarked = false;
    if (idx >= 0) {
      dbState.bookmarks.splice(idx, 1);
    } else {
      dbState.bookmarks.push({ ...item, savedAt: new Date().toISOString() });
      bookmarked = true;
    }
    persist();
    return { bookmarked, bookmarks: dbState.bookmarks };
  },

  // Mastery & XP
  getMastery: () => dbState.mastery || defaultState.mastery,

  completeTopic: (topicId, category = 'General') => {
    if (!dbState.mastery.completedTopics) dbState.mastery.completedTopics = [];
    if (!dbState.mastery.completedTopics.includes(topicId)) {
      dbState.mastery.completedTopics.push(topicId);
      dbState.mastery.totalXp = (dbState.mastery.totalXp || 0) + 100;
      if (category && dbState.mastery.categoryScores) {
        dbState.mastery.categoryScores[category] = Math.min(100, (dbState.mastery.categoryScores[category] || 50) + 5);
      }
      persist();
    }
    return dbState.mastery;
  },

  // Settings
  getSettings: () => dbState.settings || defaultState.settings,

  updateSettings: (newSettings) => {
    dbState.settings = { ...dbState.settings, ...newSettings };
    persist();
    return dbState.settings;
  },
};
