import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  RotateCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const TestModePage = () => {
  const { showToast, awardXp } = useApp();

  const [testMode, setTestMode] = useState('Course Test');
  const [subject, setSubject] = useState('Operating Systems');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');

  const [isTestActive, setIsTestActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 minutes default
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (isTestActive && !isSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isSubmitted, timeLeftSeconds]);

  const handleStartTest = async () => {
    setIsLoading(true);
    try {
      const res = await api.generateQuiz({
        topic: subject,
        count: questionCount,
        difficulty,
      });

      if (res.success && res.questions?.length > 0) {
        setQuestions(res.questions);
        setSelectedAnswers({});
        setFlaggedQuestions({});
        setCurrentQuestionIndex(0);
        setIsSubmitted(false);
        setTestResult(null);
        setTimeLeftSeconds(questionCount * 60); // 1 minute per question
        setIsTestActive(true);
      }
    } catch (e) {
      showToast('Could not initiate exam environment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const toggleFlagQuestion = (qIndex) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qIndex]: !prev[qIndex],
    }));
  };

  const handleSubmitTest = async () => {
    if (isSubmitted) return;

    let score = 0;
    const weakTopics = [];
    const strongTopics = [];

    questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (chosen === q.correctIndex) {
        score++;
        if (q.concept) strongTopics.push(q.concept);
      } else {
        if (q.concept) weakTopics.push(q.concept);
      }
    });

    const accuracy = Math.round((score / questions.length) * 100);
    setIsSubmitted(true);

    if (accuracy >= 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      awardXp(score * 25 + 100);
      showToast(`🏆 Excellent Performance! Accuracy: ${accuracy}% (+${score * 25 + 100} XP)`, 'success');
    } else {
      awardXp(score * 15 + 20);
      showToast(`Exam Finished. Accuracy: ${accuracy}%. Review diagnostics below.`, 'info');
    }

    try {
      const saveRes = await api.submitTest({
        topicId: subject.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        topicTitle: subject,
        score,
        totalQuestions: questions.length,
        timeSpentSeconds: questionCount * 60 - timeLeftSeconds,
        weakTopics,
        strongTopics,
        aiFeedback: `You achieved ${accuracy}% accuracy on ${subject}. Demonstrated solid mastery of ${strongTopics.join(', ') || 'foundations'}. Priority review recommended for: ${weakTopics.join(', ') || 'None - clean pass'}.`,
      });
      if (saveRes.success) {
        setTestResult(saveRes.result);
      }
    } catch (e) {
      console.warn('Test save error:', e.message);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Award className="w-4 h-4" />
          <span>Exam Simulation & Assessment Sandbox</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Test Yourself Mode
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          An isolated testing environment that strictly hides videos, lecture notes, and AI explanations until submission to simulate real university and GATE examination conditions.
        </p>
      </div>

      {/* Test Setup Screen */}
      {!isTestActive && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-base font-bold text-white">Configure Your Examination</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Exam Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="Data Structures and Algorithms">Data Structures & Algorithms</option>
                <option value="DBMS">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Test Mode
              </label>
              <select
                value={testMode}
                onChange={(e) => setTestMode(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value="Course Test">Comprehensive Course Test</option>
                <option value="Topic Test">Topic Focus Test</option>
                <option value="Exam Viva">GATE Simulation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value={5}>5 Questions (5 mins)</option>
                <option value={10}>10 Questions (10 mins)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none"
              >
                <option value="Medium">Medium (Standard University)</option>
                <option value="Hard">Hard (GATE Level)</option>
                <option value="Easy">Easy (Conceptual Fundamentals)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>All videos and notes will be hidden during this timed session.</span>
            </div>

            <button
              onClick={handleStartTest}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Examination Paper...</span>
                </>
              ) : (
                <>
                  <span>Begin Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Live Examination Environment */}
      {isTestActive && (
        <div className="space-y-6">
          {/* Exam Status Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                OFFICIAL EXAMINATION IN PROGRESS
              </span>
              <h3 className="text-sm font-bold text-white">{subject} • {difficulty}</h3>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                  timeLeftSeconds < 60
                    ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                    : 'bg-slate-950 text-emerald-400 border-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Submit Paper
                </button>
              ) : (
                <button
                  onClick={() => setIsTestActive(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Exit Exam
                </button>
              )}
            </div>
          </div>

          {/* Question Palette & Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              const isFlagged = flaggedQuestions[idx];

              let badgeStyle = 'bg-slate-900 text-slate-400 border-slate-800';

              if (isAnswered) {
                badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
              }
              if (isFlagged) {
                badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              }
              if (isCurrent) {
                badgeStyle += ' ring-2 ring-emerald-400';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-mono shrink-0 transition-all ${badgeStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Display */}
          {questions[currentQuestionIndex] && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>

                <button
                  onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    flaggedQuestions[currentQuestionIndex]
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {flaggedQuestions[currentQuestionIndex] ? '★ Flagged' : '☆ Mark for Review'}
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                {questions[currentQuestionIndex].question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const qId = questions[currentQuestionIndex].id;
                  const isSelected = selectedAnswers[qId] === optIdx;
                  const isCorrect = optIdx === questions[currentQuestionIndex].correctIndex;

                  let optClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isSelected && !isSubmitted) {
                    optClass = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-red-500/20 border-red-500 text-red-300';
                    } else {
                      optClass = 'opacity-40 bg-slate-950 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qId, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optClass}`}
                    >
                      <span>
                        <strong className="mr-3 text-slate-500 font-mono">
                          {String.fromCharCode(65 + optIdx)}.
                        </strong>
                        {opt}
                      </span>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Post-Submit Question Explanation */}
              {isSubmitted && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Official Solution & Rationale:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-semibold"
                >
                  ← Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Diagnostic Result Banner (If Submitted) */}
          {isSubmitted && testResult && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    EXAM PERFORMANCE ANALYSIS
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Score: {testResult.score} / {testResult.totalQuestions}{' '}
                    <span className="text-emerald-400">({testResult.accuracy}%)</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    Time: {formatTime(testResult.timeSpentSeconds)}
                  </span>
                  <button
                    onClick={() => setIsTestActive(false)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Take Another Exam
                  </button>
                </div>
              </div>

              {/* Diagnostic Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strong Areas */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mastered Concepts ({testResult.strongTopics?.length || 0})</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {testResult.strongTopics?.map((t, idx) => (
                      <li key={idx}>✓ {t}</li>
                    ))}
                    {(!testResult.strongTopics || testResult.strongTopics.length === 0) && (
                      <li className="text-slate-500">None identified</li>
                    )}
                  </ul>
                </div>

                {/* Weak Areas */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Areas Requiring Revision ({testResult.weakTopics?.length || 0})</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {testResult.weakTopics?.map((t, idx) => (
                      <li key={idx}>⚠️ {t}</li>
                    ))}
                    {(!testResult.weakTopics || testResult.weakTopics.length === 0) && (
                      <li className="text-emerald-400">Zero weak areas! Outstanding job.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* AI Performance Advice */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-emerald-400">🤖 AI Examiner Feedback:</span>
                <p className="text-slate-300 leading-relaxed">{testResult.aiFeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
