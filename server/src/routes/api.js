import express from 'express';
import { db } from '../db.js';
import { youtubeService } from '../services/youtubeService.js';
import { transcriptService } from '../services/transcriptService.js';
import { aiService } from '../services/aiService.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LearnTube AI API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// --- COURSES & SEARCH ---

// Get all curated courses
router.get('/courses', (req, res) => {
  const courses = youtubeService.getAllCourses();
  res.json({ success: true, count: courses.length, courses });
});

// Get course by ID with complete syllabus tree and modules
router.get('/courses/:id', (req, res) => {
  const course = youtubeService.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course syllabus not found' });
  }
  res.json({ success: true, course });
});

// Search subjects, courses, videos, channels
router.get('/search', async (req, res) => {
  try {
    const { q, type, level, goal, language } = req.query;
    const settings = db.getSettings();
    const results = await youtubeService.search({
      query: q,
      type,
      level,
      goal,
      language: language || settings.preferredLanguage,
      apiKey: settings.youtubeApiKey,
    });
    res.json({ success: true, ...results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get verified educational university channels
router.get('/discovery/channels', (req, res) => {
  const channels = youtubeService.getChannels();
  res.json({ success: true, count: channels.length, channels });
});

// --- YOUTUBE VIDEO DETAILS & ALTERNATIVES ---

router.get('/youtube/details', (req, res) => {
  const { courseId, videoId } = req.query;
  if (!videoId) {
    return res.status(400).json({ success: false, message: 'videoId is required' });
  }
  const details = youtubeService.getVideoDetails(courseId, videoId);
  res.json({ success: true, ...details });
});

// --- TRANSCRIPTS ---

router.get('/transcript/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title } = req.query;
    const transcript = await transcriptService.getTranscript(videoId, title);
    res.json({ success: true, transcript });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- AI TUTOR, SUMMARY, QUIZ & SOCRATIC ---

// AI Tutor Interactive Chat
router.post('/ai/tutor', async (req, res) => {
  try {
    const { message, history, topic, videoTitle, transcript, language, persona } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }
    const settings = db.getSettings();
    const response = await aiService.tutorChat({
      message,
      history,
      topic,
      videoTitle,
      transcript,
      language: language || settings.tutorLanguage || settings.preferredLanguage,
      persona: persona || settings.tutorPersona,
      userApiKey: settings.geminiApiKey,
    });
    res.json({ success: true, ...response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Generate Structured Video Summary
router.post('/ai/summary', async (req, res) => {
  try {
    const { topic, videoTitle, transcript, level } = req.body;
    const settings = db.getSettings();
    const result = await aiService.generateSummary({
      topic,
      videoTitle,
      transcript,
      level,
      userApiKey: settings.geminiApiKey,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Generate Quiz (MCQs, True/False, Difficulty scaling)
router.post('/ai/quiz', async (req, res) => {
  try {
    const { topic, videoTitle, count, difficulty, type, language } = req.body;
    const settings = db.getSettings();
    const result = await aiService.generateQuiz({
      topic,
      videoTitle,
      count: Number(count) || 5,
      difficulty: difficulty || 'Medium',
      type: type || 'MCQ',
      language: language || settings.preferredLanguage,
      userApiKey: settings.geminiApiKey,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Socratic Dialogue & Interview Simulation
router.post('/ai/socratic', async (req, res) => {
  try {
    const { topic, studentInput, history, mode } = req.body;
    const settings = db.getSettings();
    const result = await aiService.socraticDialogue({
      topic,
      studentInput,
      history,
      mode: mode || 'socratic_discussion',
      userApiKey: settings.geminiApiKey,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Custom Learning Path Generator
router.post('/ai/path', async (req, res) => {
  try {
    const { subject, goal, level } = req.body;
    const settings = db.getSettings();
    const result = await aiService.generateLearningPath({
      subject,
      goal,
      level,
      userApiKey: settings.geminiApiKey,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- SMART NOTES ---

router.get('/notes', (req, res) => {
  const notes = db.getNotes(req.query);
  res.json({ success: true, count: notes.length, notes });
});

router.post('/notes', (req, res) => {
  const note = db.createNote(req.body);
  res.json({ success: true, note });
});

router.put('/notes/:id', (req, res) => {
  const updated = db.updateNote(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }
  res.json({ success: true, note: updated });
});

router.delete('/notes/:id', (req, res) => {
  const deleted = db.deleteNote(req.params.id);
  res.json({ success: deleted });
});

// --- LEARNING PATHS (SAVED) ---

router.get('/paths', (req, res) => {
  const paths = db.getPaths();
  res.json({ success: true, count: paths.length, paths });
});

router.post('/paths', (req, res) => {
  const saved = db.savePath(req.body);
  res.json({ success: true, path: saved });
});

router.delete('/paths/:id', (req, res) => {
  const deleted = db.deletePath(req.params.id);
  res.json({ success: deleted });
});

// --- TEST RESULTS & ATTEMPTS ---

router.get('/tests', (req, res) => {
  const results = db.getTestResults();
  res.json({ success: true, count: results.length, results });
});

router.post('/tests', (req, res) => {
  const { result, xpEarned } = db.saveTestResult(req.body);
  res.json({ success: true, result, xpEarned });
});

// --- FLASHCARD MASTERY ---

router.get('/flashcards/mastery', (req, res) => {
  const mastery = db.getFlashcardMastery();
  res.json({ success: true, mastery });
});

router.post('/flashcards/mastery', (req, res) => {
  const { cardId, status } = req.body;
  const updated = db.updateFlashcard(cardId, status);
  res.json({ success: true, cardMastery: updated });
});

// --- BOOKMARKS ---

router.get('/bookmarks', (req, res) => {
  const bookmarks = db.getBookmarks();
  res.json({ success: true, count: bookmarks.length, bookmarks });
});

router.post('/bookmarks', (req, res) => {
  const result = db.toggleBookmark(req.body);
  res.json({ success: true, ...result });
});

// --- MASTERY & PROGRESS ---

router.get('/mastery', (req, res) => {
  const mastery = db.getMastery();
  res.json({ success: true, mastery });
});

router.post('/mastery/complete', (req, res) => {
  const { topicId, category } = req.body;
  const mastery = db.completeTopic(topicId, category);
  res.json({ success: true, mastery });
});

// --- USER SETTINGS ---

router.get('/settings', (req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, settings });
});

router.put('/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

export default router;
