import React, { useState, useEffect } from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  Pin,
  Download,
  RotateCw,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Award,
  AlertCircle,
  Users,
  Send,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const WorkspaceTabs = ({
  topic,
  video,
  module,
  course,
  transcript,
  initialActiveTab = 'summary',
}) => {
  const { showToast, awardXp } = useApp();
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  // --- STATE FOR NOTES ---
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isGeneratingAiNote, setIsGeneratingAiNote] = useState(false);

  // --- STATE FOR SUMMARY ---
  const [summaryData, setSummaryData] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // --- STATE FOR FLASHCARDS ---
  const [flashcards, setFlashcards] = useState([
    {
      id: 'fc1',
      question: 'What is the primary difference in memory sharing between a Process and a Thread?',
      answer: 'Threads in the same process share Code, Data, and Heap memory, but keep private Stacks and Registers. Processes have completely isolated virtual address spaces.',
      mnemonic: 'Think: Threads share the table (Heap); each worker holds their own pen (Stack).'
    },
    {
      id: 'fc2',
      question: 'State the 4 Coffman conditions for Deadlock.',
      answer: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
      mnemonic: 'M-H-N-C (Make Hot Noodles Carefully)'
    },
    {
      id: 'fc3',
      question: 'Why does Belady’s anomaly happen in FIFO page replacement?',
      answer: 'Because FIFO is not a stack algorithm; the set of pages in memory of size N is not guaranteed to be a subset of size N+1.',
      mnemonic: 'FIFO forgets the future, only cares for the past.'
    },
    {
      id: 'fc4',
      question: 'What does the Banker’s Algorithm verify before granting a resource request?',
      answer: 'It verifies whether granting the request leaves the entire system in a "Safe State", meaning there exists at least one order to satisfy all remaining maximum demands.',
      mnemonic: 'Safety Check: Need <= Work.'
    }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardMastery, setFlashcardMastery] = useState({});

  // --- STATE FOR QUIZ ---
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizCount, setQuizCount] = useState(5);

  // --- STATE FOR SOCRATIC DISCUSSION ---
  const [socraticMode, setSocraticMode] = useState('socratic_discussion');
  const [socraticChat, setSocraticChat] = useState([]);
  const [socraticInput, setSocraticInput] = useState('');
  const [isLoadingSocratic, setIsLoadingSocratic] = useState(false);

  // Load Notes
  const loadNotes = async () => {
    try {
      const res = await api.getNotes({ topicId: module?.id || topic });
      if (res.success) setNotes(res.notes);
    } catch (e) {
      console.warn('Notes load error:', e.message);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [module?.id, topic]);

  // Load Summary
  const loadSummary = async () => {
    if (summaryData) return;
    setIsLoadingSummary(true);
    try {
      const res = await api.generateSummary({
        topic: module?.title || topic,
        videoTitle: video?.title,
        transcript,
      });
      if (res.success) setSummaryData(res.summary);
    } catch (e) {
      showToast('Could not load summary', 'error');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'summary' && !summaryData) {
      loadSummary();
    }
  }, [activeTab]);

  // Load Quiz
  const loadQuiz = async (difficulty = quizDifficulty, count = quizCount) => {
    setIsLoadingQuiz(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    try {
      const res = await api.generateQuiz({
        topic: module?.title || topic,
        videoTitle: video?.title,
        count,
        difficulty,
      });
      if (res.success) {
        setQuizQuestions(res.questions);
      }
    } catch (e) {
      showToast('Failed to generate quiz', 'error');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz' && quizQuestions.length === 0) {
      loadQuiz();
    }
  }, [activeTab]);

  // --- ACTIONS FOR NOTES ---
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim()) return;

    try {
      const res = await api.createNote({
        title: noteTitle.trim() || 'Study Note',
        content: noteContent,
        topicId: module?.id || topic || 'general',
        topicTitle: module?.title || topic,
        videoId: video?.id,
        videoTitle: video?.title,
        tags: [course?.category || 'Computer Science', 'Lecture Notes'],
      });
      if (res.success) {
        setNotes([res.note, ...notes]);
        setNoteTitle('');
        setNoteContent('');
        showToast('Note saved successfully!');
      }
    } catch (err) {
      showToast('Failed to save note', 'error');
    }
  };

  const handleGenerateAiNote = async () => {
    setIsGeneratingAiNote(true);
    try {
      const res = await api.generateSummary({
        topic: module?.title || topic,
        videoTitle: video?.title,
        transcript,
      });
      if (res.success) {
        const s = res.summary;
        const generatedContent = `### ${s.quickSummary}\n\n**Key Concepts:**\n${s.importantConcepts.map(c => `• ${c}`).join('\n')}\n\n**Exam Checklist:**\n${s.examNotes.map(e => `✓ ${e}`).join('\n')}`;
        const newNoteRes = await api.createNote({
          title: `AI Note: ${module?.title || topic}`,
          content: generatedContent,
          topicId: module?.id || topic || 'general',
          topicTitle: module?.title || topic,
          videoId: video?.id,
          videoTitle: video?.title,
          tags: ['AI Generated', 'Revision'],
          isAiGenerated: true,
        });
        if (newNoteRes.success) {
          setNotes([newNoteRes.note, ...notes]);
          showToast('Generated AI study note added to your ledger!');
        }
      }
    } catch (err) {
      showToast('Could not generate AI note', 'error');
    } finally {
      setIsGeneratingAiNote(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
      showToast('Note deleted');
    } catch (e) {
      showToast('Could not delete note', 'error');
    }
  };

  const handleExportNotes = () => {
    if (notes.length === 0) {
      showToast('No notes to export', 'info');
      return;
    }
    const markdown = `# Study Notes: ${module?.title || topic}\n\nGenerated from LearnTube AI\n\n` +
      notes.map(n => `## ${n.title}\n*Saved on ${new Date(n.createdAt).toLocaleDateString()}*\n\n${n.content}\n\n---`).join('\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LearnTube_${(module?.title || topic).replace(/[^a-zA-Z0-9]+/g, '_')}_Notes.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Notes downloaded as Markdown file!');
  };

  // --- ACTIONS FOR FLASHCARDS ---
  const handleFlashcardStatus = async (status) => {
    const card = flashcards[currentCardIndex];
    if (!card) return;

    try {
      await api.updateFlashcard(card.id, status);
      setFlashcardMastery((prev) => ({ ...prev, [card.id]: status }));
      setIsFlipped(false);
      if (status === 'know') {
        awardXp(15);
      }
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        showToast('🎉 You completed all flashcards in this deck! +50 XP', 'success');
        awardXp(50);
      }
    } catch (e) {
      // local fallback
      setIsFlipped(false);
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }
  };

  // --- ACTIONS FOR QUIZ ---
  const handleSelectOption = (qId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitted || quizQuestions.length === 0) return;

    let score = 0;
    const weakTopics = [];
    const strongTopics = [];

    quizQuestions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (chosen === q.correctIndex) {
        score++;
        if (q.concept) strongTopics.push(q.concept);
      } else {
        if (q.concept) weakTopics.push(q.concept);
      }
    });

    setQuizScore(score);
    setIsSubmitted(true);

    const accuracy = Math.round((score / quizQuestions.length) * 100);

    if (accuracy >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      awardXp(score * 20 + 50);
      showToast(`🎯 Great job! Accuracy: ${accuracy}% (+${score * 20 + 50} XP)`, 'success');
    } else {
      awardXp(score * 10);
      showToast(`Completed! Score: ${score}/${quizQuestions.length}. Review weak concepts below.`, 'info');
    }

    try {
      await api.submitTest({
        topicId: module?.id || topic,
        topicTitle: module?.title || topic,
        score,
        totalQuestions: quizQuestions.length,
        weakTopics,
        strongTopics,
        aiFeedback: `Completed with ${accuracy}% accuracy. Strongest in ${strongTopics.join(', ') || 'basics'}. Focus review on: ${weakTopics.join(', ') || 'None'}.`,
      });
    } catch (e) {
      console.warn('Test save warning:', e.message);
    }
  };

  // --- ACTIONS FOR SOCRATIC DISCUSSION ---
  const handleSocraticSend = async () => {
    const text = socraticInput.trim();
    if (!text || isLoadingSocratic) return;

    const userMsg = { role: 'student', text };
    setSocraticChat((prev) => [...prev, userMsg]);
    setSocraticInput('');
    setIsLoadingSocratic(true);

    try {
      const res = await api.socraticDialogue({
        topic: module?.title || topic,
        studentInput: text,
        history: socraticChat,
        mode: socraticMode,
      });

      if (res.success) {
        setSocraticChat((prev) => [...prev, { role: 'ai', text: res.response }]);
      }
    } catch (e) {
      setSocraticChat((prev) => [
        ...prev,
        { role: 'ai', text: '⚠️ Unable to connect to Socratic mentor. Please try again.' },
      ]);
    } finally {
      setIsLoadingSocratic(false);
    }
  };

  const handleStartSocratic = (mode) => {
    setSocraticMode(mode);
    setSocraticChat([]);
    setIsLoadingSocratic(true);
    api
      .socraticDialogue({
        topic: module?.title || topic,
        studentInput: 'start',
        history: [],
        mode,
      })
      .then((res) => {
        if (res.success) {
          setSocraticChat([{ role: 'ai', text: res.response }]);
        }
      })
      .finally(() => setIsLoadingSocratic(false));
  };

  const tabs = [
    { id: 'summary', label: 'AI Summary', icon: BookOpen },
    { id: 'notes', label: `Smart Notes (${notes.length})`, icon: FileText },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'AI Quiz', icon: HelpCircle },
    { id: 'socratic', label: 'Socratic & Viva', icon: MessageSquare },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Tabs Bar */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-800 bg-slate-950/70 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-5 min-h-[400px]">
        {/* ========================================================= */}
        {/* TAB 1: AI SUMMARY */}
        {/* ========================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {isLoadingSummary && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                <span>Synthesizing structured study guide from academic syllabus...</span>
              </div>
            )}

            {!isLoadingSummary && summaryData && (
              <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
                {/* Quick Summary Banner */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Summary</span>
                  </h4>
                  <p className="text-slate-200 text-xs">{summaryData.quickSummary}</p>
                </div>

                {/* Detailed Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Detailed Overview
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {summaryData.detailedSummary}
                  </p>
                </div>

                {/* Important Concepts Pills */}
                {summaryData.importantConcepts && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Important Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {summaryData.importantConcepts.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-[11px]"
                        >
                          ✦ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Definitions Table */}
                {summaryData.keyDefinitions && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Key Terminology & Definitions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {summaryData.keyDefinitions.map((d, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1"
                        >
                          <span className="font-bold text-emerald-400 font-mono text-xs">
                            {d.term}
                          </span>
                          <p className="text-[11px] text-slate-300">{d.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulas & Calculations */}
                {summaryData.formulas && summaryData.formulas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Important Formulas & Quantitative Metrics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {summaryData.formulas.map((f, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1"
                        >
                          <span className="font-semibold text-slate-200 text-xs">{f.name}</span>
                          <div className="px-2 py-1 rounded bg-slate-950 font-mono text-emerald-400 text-xs border border-slate-800">
                            {f.formula}
                          </div>
                          <p className="text-[10px] text-slate-400">{f.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Notes & Common Traps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {summaryData.examNotes && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                      <h5 className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                        <Award className="w-4 h-4" />
                        <span>University Exam High-Yield Points</span>
                      </h5>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {summaryData.examNotes.map((note, i) => (
                          <li key={i}>✓ {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summaryData.commonMistakes && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1.5">
                      <h5 className="font-bold text-red-400 flex items-center gap-1.5 text-xs">
                        <AlertCircle className="w-4 h-4" />
                        <span>Common Student Traps & Pitfalls</span>
                      </h5>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {summaryData.commonMistakes.map((mistake, i) => (
                          <li key={i}>⚠️ {mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SMART NOTES */}
        {/* ========================================================= */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Create Note Input */}
            <form onSubmit={handleCreateNote} className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Write or Generate Note for "{module?.title || topic}"</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiNote}
                    disabled={isGeneratingAiNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAiNote ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>Generate AI Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportNotes}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="Export notes as Markdown"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export (.md)</span>
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title (e.g. Critical Section & Peterson Algorithm Proof)..."
                className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500/60"
              />

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your study notes, key equations, or lecturer takeaways here..."
                rows={3}
                className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500/60 resize-y"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!noteTitle.trim() && !noteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
                >
                  Save Note
                </button>
              </div>
            </form>

            {/* Existing Notes Feed */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Saved Notes for this Module ({notes.length})
              </h4>

              {notes.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  No notes saved yet. Write your thoughts above or click <strong>Generate AI Notes</strong>!
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 space-y-2 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-200 text-xs">{note.title}</h5>
                          {note.isAiGenerated && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold text-[9px] border border-emerald-500/20">
                              AI Generated
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FLASHCARDS */}
        {/* ========================================================= */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6 max-w-xl mx-auto py-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">
                Card {currentCardIndex + 1} of {flashcards.length}
              </span>
              <span>Click card to flip • Spaced Repetition</span>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-72 cursor-pointer perspective-1000 select-none group"
            >
              <div
                className={`w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl border p-6 flex flex-col justify-between shadow-2xl ${
                  isFlipped
                    ? 'rotate-y-180 bg-slate-900 border-emerald-500/50 shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Front */}
                <div className="space-y-4 backface-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    CONCEPT / QUESTION
                  </span>
                  <p className="text-sm md:text-base font-semibold text-slate-100 leading-snug">
                    {flashcards[currentCardIndex]?.question}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    (Click to reveal explanation and mnemonic)
                  </p>
                </div>

                {/* Back */}
                <div className="space-y-3 backface-hidden rotate-y-180">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    ANSWER & EXPLANATION
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {flashcards[currentCardIndex]?.answer}
                  </p>
                  {flashcards[currentCardIndex]?.mnemonic && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                      💡 <strong>Mnemonic Hook:</strong> {flashcards[currentCardIndex].mnemonic}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 text-right">
                  Tap to flip
                </div>
              </div>
            </div>

            {/* Flashcard Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleFlashcardStatus('dont_know')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Need Review</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Flip</span>
              </button>

              <button
                onClick={() => handleFlashcardStatus('know')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Know This (+15 XP)</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AI QUIZ */}
        {/* ========================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* Quiz Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span>Difficulty:</span>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => {
                      setQuizDifficulty(e.target.value);
                      loadQuiz(e.target.value, quizCount);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-semibold focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard (GATE Level)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span>Questions:</span>
                  <select
                    value={quizCount}
                    onChange={(e) => {
                      setQuizCount(Number(e.target.value));
                      loadQuiz(quizDifficulty, Number(e.target.value));
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => loadQuiz(quizDifficulty, quizCount)}
                disabled={isLoadingQuiz}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoadingQuiz ? 'animate-spin' : ''}`} />
                <span>Regenerate Quiz</span>
              </button>
            </div>

            {isLoadingQuiz ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                <span>Generating conceptual exam questions from lecture syllabus...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {quizQuestions.map((q, qIndex) => {
                  const chosenOption = selectedAnswers[q.id];
                  const hasAnswered = chosenOption !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs md:text-sm font-semibold text-slate-100 leading-snug">
                          <span className="text-emerald-400 font-mono mr-2">Q{qIndex + 1}.</span>
                          {q.question}
                        </h4>
                        {q.concept && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                            {q.concept}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = chosenOption === optIdx;
                          const isCorrect = optIdx === q.correctIndex;

                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                          if (isSelected && !isSubmitted) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';
                          }

                          if (isSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                            } else {
                              btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              disabled={isSubmitted}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>
                                <strong className="mr-2 text-slate-500 font-mono">
                                  {String.fromCharCode(65 + optIdx)}.
                                </strong>
                                {opt}
                              </span>

                              {isSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {isSubmitted && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Post-submission deep explanation */}
                      {isSubmitted && (
                        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Why this answer is correct:</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {q.explanation}
                          </p>
                          {q.recommendedReview && (
                            <p className="text-[10px] text-amber-400 pt-1">
                              🔍 <strong>Review Recommendation:</strong> {q.recommendedReview}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Submit Quiz Bar */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    {isSubmitted ? (
                      <span className="font-bold text-white text-sm">
                        Score:{' '}
                        <span className="text-emerald-400">
                          {quizScore} / {quizQuestions.length}
                        </span>{' '}
                        ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        {Object.keys(selectedAnswers).length} of {quizQuestions.length} answered
                      </span>
                    )}
                  </div>

                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length === 0}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={() => loadQuiz(quizDifficulty, quizCount)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Try Another Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SOCRATIC & VIVA */}
        {/* ========================================================= */}
        {activeTab === 'socratic' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Mode Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'socratic_discussion', label: 'Socratic Discussion', icon: '🤔' },
                { id: 'interview_me', label: 'Tech Interview', icon: '👔' },
                { id: 'exam_viva', label: 'Exam Viva', icon: '🎓' },
                { id: 'debate_concept', label: 'Debate Concept', icon: '⚔️' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleStartSocratic(m.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    socraticMode === m.id
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span className="truncate">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Conversation Feed */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 min-h-[300px] max-h-[420px] overflow-y-auto">
              {socraticChat.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                  <p>Select a mode above or click below to begin your Socratic session!</p>
                  <button
                    onClick={() => handleStartSocratic(socraticMode)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 font-bold text-xs"
                  >
                    Start Session
                  </button>
                </div>
              ) : (
                socraticChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'student'
                          ? 'bg-emerald-600 text-slate-950 font-medium rounded-br-none'
                          : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}

              {isLoadingSocratic && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Socratic tutor is reflecting on your answer...</span>
                </div>
              )}
            </div>

            {/* Socratic Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSocraticSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={socraticInput}
                onChange={(e) => setSocraticInput(e.target.value)}
                placeholder="Explain your reasoning here..."
                disabled={isLoadingSocratic}
                className="flex-1 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60"
              />
              <button
                type="submit"
                disabled={!socraticInput.trim() || isLoadingSocratic}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
