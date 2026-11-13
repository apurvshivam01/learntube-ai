import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
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

      if (res.success && res.quiz?.questions?.length) {
        setQuestions(res.quiz.questions);
        setSelectedAnswers({});
        setFlaggedQuestions({});
        setTimeLeftSeconds(questionCount * 60);
        setIsSubmitted(false);
        setTestResult(null);
        setCurrentQuestionIndex(0);
        setIsTestActive(true);
        showToast('Examination session active. Good luck!');
      } else {
        showToast('Failed to generate test paper', 'error');
      }
    } catch (e) {
      showToast('Error loading test', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const toggleFlagQuestion = (idx) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubmitTest = async () => {
    let score = 0;
    const weakTopics = [];
    const strongTopics = [];

    questions.forEach((q) => {
      const isCorrect = selectedAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        score++;
        strongTopics.push(q.topic || subject);
      } else {
        weakTopics.push(q.topic || subject);
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
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Exam Simulation & Assessment Sandbox</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
          Test Yourself Mode
        </h1>
        <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
          An isolated testing environment that strictly hides videos, lecture notes, and AI explanations until submission to simulate real university and GATE examination conditions.
        </p>
      </div>

      {/* Test Setup Screen */}
      {!isTestActive && (
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-6">
          <h2 className="text-base font-semibold text-white">Configure Your Examination</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Exam Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500"
              >
                <option value="Operating Systems">Operating Systems</option>
                <option value="Data Structures and Algorithms">Data Structures & Algorithms</option>
                <option value="DBMS">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Test Mode
              </label>
              <select
                value={testMode}
                onChange={(e) => setTestMode(e.target.value)}
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500"
              >
                <option value="Course Test">Comprehensive Course Test</option>
                <option value="Topic Test">Topic Focus Test</option>
                <option value="Exam Viva">GATE Simulation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500"
              >
                <option value={5}>5 Questions (5 mins)</option>
                <option value={10}>10 Questions (10 mins)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500"
              >
                <option value="Medium">Medium (Standard University)</option>
                <option value="Hard">Hard (GATE Level)</option>
                <option value="Easy">Easy (Conceptual Fundamentals)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1220] border border-[#22304A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>All videos and notes will be hidden during this timed session.</span>
            </div>

            <button
              onClick={handleStartTest}
              disabled={isLoading}
              className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-[#070B14] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shrink-0"
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
          <div className="p-4 rounded-xl bg-[#111A2B] border border-[#22304A] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                OFFICIAL EXAMINATION IN PROGRESS
              </span>
              <h3 className="text-sm font-semibold text-white">{subject} • {difficulty}</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border ${
                  timeLeftSeconds < 60
                    ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                    : 'bg-[#0B1220] text-teal-400 border-[#22304A]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#070B14] font-semibold text-xs transition-colors"
                >
                  Submit Paper
                </button>
              ) : (
                <button
                  onClick={() => setIsTestActive(false)}
                  className="px-4 py-2 rounded-lg bg-[#162033] hover:bg-[#1f2d47] text-white text-xs font-medium border border-[#22304A]"
                >
                  Exit Exam
                </button>
              )}
            </div>
          </div>

          {/* Question Palette & Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              const isFlagged = flaggedQuestions[idx];

              let badgeStyle = 'bg-[#111A2B] text-[#94A3B8] border-[#22304A]';

              if (isAnswered) {
                badgeStyle = 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-semibold';
              }
              if (isFlagged) {
                badgeStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/40';
              }
              if (isCurrent) {
                badgeStyle += ' ring-2 ring-teal-400';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-mono shrink-0 transition-all ${badgeStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Display */}
          {questions[currentQuestionIndex] && (
            <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-teal-400 font-mono">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>

                <button
                  onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    flaggedQuestions[currentQuestionIndex]
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-medium'
                      : 'bg-[#0B1220] border-[#22304A] text-[#94A3B8] hover:text-white'
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

                  let optClass = 'bg-[#0B1220] border-[#22304A] text-[#94A3B8] hover:border-[#324466] hover:text-white';

                  if (isSelected && !isSubmitted) {
                    optClass = 'bg-teal-500/15 border-teal-500/60 text-teal-300 font-semibold';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-teal-500/15 border-teal-500 text-teal-300 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-red-500/15 border-red-500 text-red-300';
                    } else {
                      optClass = 'opacity-40 bg-[#0B1220] border-[#22304A] text-[#64748B]';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qId, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optClass}`}
                    >
                      <span>
                        <strong className="mr-3 text-[#64748B] font-mono">
                          {String.fromCharCode(65 + optIdx)}.
                        </strong>
                        {opt}
                      </span>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
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
                <div className="p-4 rounded-xl bg-[#0B1220] border border-[#22304A] space-y-2 text-xs">
                  <div className="font-semibold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Official Solution & Rationale:</span>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">
                    {questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#22304A]">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-lg bg-[#0B1220] hover:bg-[#162033] border border-[#22304A] text-[#94A3B8] hover:text-white disabled:opacity-30 text-xs font-medium transition-colors"
                >
                  ← Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 rounded-lg bg-[#0B1220] hover:bg-[#162033] border border-[#22304A] text-[#94A3B8] hover:text-white disabled:opacity-30 text-xs font-medium transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Diagnostic Result Banner (If Submitted) */}
          {isSubmitted && testResult && (
            <div className="p-6 rounded-2xl bg-[#111A2B] border border-teal-500/40 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22304A] pb-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                    EXAM PERFORMANCE ANALYSIS
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-white">
                    Score: {testResult.score} / {testResult.totalQuestions}{' '}
                    <span className="text-teal-400">({testResult.accuracy}%)</span>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#94A3B8] font-mono">
                    Time: {formatTime(testResult.timeSpentSeconds)}
                  </span>
                  <button
                    onClick={() => setIsTestActive(false)}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#070B14] font-semibold text-xs transition-colors"
                  >
                    Take Another Exam
                  </button>
                </div>
              </div>

              {/* Diagnostic Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strong Areas */}
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 space-y-2">
                  <h4 className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mastered Concepts ({testResult.strongTopics?.length || 0})</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#94A3B8]">
                    {testResult.strongTopics?.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="text-teal-400 font-bold">✓</span> {t}
                      </li>
                    ))}
                    {(!testResult.strongTopics || testResult.strongTopics.length === 0) && (
                      <li className="text-[#64748B]">None identified</li>
                    )}
                  </ul>
                </div>

                {/* Weak Areas */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                  <h4 className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Areas Requiring Revision ({testResult.weakTopics?.length || 0})</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-[#94A3B8]">
                    {testResult.weakTopics?.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="text-amber-400 font-bold">⚠️</span> {t}
                      </li>
                    ))}
                    {(!testResult.weakTopics || testResult.weakTopics.length === 0) && (
                      <li className="text-teal-400">Zero weak areas! Outstanding job.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* AI Performance Advice */}
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#22304A] space-y-1 text-xs">
                <span className="font-semibold text-teal-400">AI Examiner Feedback:</span>
                <p className="text-[#94A3B8] leading-relaxed">{testResult.aiFeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
