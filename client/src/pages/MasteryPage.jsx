import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const MasteryPage = () => {
  const { mastery } = useApp();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const res = await api.getTests();
        if (res.success) setTests(res.results);
      } catch (e) {
        console.warn('Test load error:', e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTests();
  }, []);

  const totalXp = mastery?.totalXp || 150;
  const levelNumber = Math.floor(totalXp / 200) + 1;
  const xpIntoCurrentLevel = totalXp % 200;
  const levelProgressPercent = Math.round((xpIntoCurrentLevel / 200) * 100);

  const categories = mastery?.categoryScores || {
    'Operating Systems': 80,
    'Data Structures': 75,
    'DBMS': 65,
    'Computer Networks': 70,
    'Machine Learning': 60,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Engineering Knowledge Portfolio</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
          Mastery & Academic Velocity
        </h1>
        <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
          Track verified course completions, examination performance metrics, and subject mastery radar across your computer science curriculum.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level Card */}
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Scholar Rank
            </span>
            <Award className="w-5 h-5 text-teal-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">Level {levelNumber}</h3>
            <p className="text-xs text-[#94A3B8]">
              {xpIntoCurrentLevel}/200 XP to Level {levelNumber + 1}
            </p>
          </div>
          <div className="w-full h-2 bg-[#070B14] rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${levelProgressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* XP Card */}
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Total XP Earned
            </span>
            <Zap className="w-5 h-5 text-teal-400 fill-teal-400/20" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{totalXp} XP</h3>
            <p className="text-xs text-[#94A3B8] mt-1">Earned via lectures, tests & flashcards</p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Learning Streak
            </span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{mastery?.streakDays || 1} Days</h3>
            <p className="text-xs text-[#94A3B8] mt-1">Keep studying daily to maintain momentum</p>
          </div>
        </div>

        {/* Completed Topics Card */}
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Completed Modules
            </span>
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {mastery?.completedTopics?.length || 0} Modules
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">Verified university lecture completion</p>
          </div>
        </div>
      </div>

      {/* Category Mastery Progress */}
      <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-6">
        <div className="flex items-center justify-between border-b border-[#22304A] pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span>Subject Mastery Breakdown</span>
          </h2>
          <span className="text-xs text-[#64748B]">Target: 90%+ for exam and interview readiness</span>
        </div>

        <div className="space-y-4">
          {Object.entries(categories).map(([cat, score]) => (
            <div key={cat} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{cat}</span>
                <span className="font-mono text-teal-400 font-semibold">{score}% Mastery</span>
              </div>
              <div className="w-full h-2.5 bg-[#070B14] rounded-full overflow-hidden p-0.5 border border-[#22304A]">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Exam History */}
      <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-6">
        <div className="flex items-center justify-between border-b border-[#22304A] pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Recent Exam Submissions & Accuracy Ledger</span>
          </h2>

          <Link
            to="/test"
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
          >
            <span>Take New Exam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-4 rounded-xl bg-[#0B1220] border border-[#22304A] h-20 animate-pulse" />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="p-8 text-center text-[#64748B] text-xs border border-dashed border-[#22304A] rounded-xl">
            No exam sessions logged yet. Head to <strong>Practice</strong> to take your first assessment!
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-xl bg-[#0B1220] border border-[#22304A] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-teal-400 font-mono">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">{test.topicTitle}</h4>
                  <p className="text-xs text-[#94A3B8]">{test.aiFeedback}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-bold text-teal-400">
                      {test.score} / {test.totalQuestions}
                    </span>
                    <span className="block text-[10px] text-[#64748B] font-mono">
                      {test.accuracy}% Accuracy
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
