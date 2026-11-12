import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Bookmark,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const PathGeneratorPage = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [subjectInput, setSubjectInput] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [goal, setGoal] = useState('Complete Course');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState(null);
  const [savedPaths, setSavedPaths] = useState([]);

  const loadSavedPaths = async () => {
    try {
      const res = await api.getPaths();
      if (res.success) setSavedPaths(res.paths);
    } catch (e) {
      console.warn('Paths load error:', e.message);
    }
  };

  useEffect(() => {
    loadSavedPaths();
  }, []);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!subjectInput.trim()) return;

    setIsGenerating(true);
    setGeneratedPath(null);

    try {
      const res = await api.generatePath({
        subject: subjectInput.trim(),
        goal,
        level,
      });

      if (res.success && res.path) {
        setGeneratedPath(res.path);
        showToast('Learning path generated! Review stages below.');
      }
    } catch (err) {
      showToast('Could not generate path', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePath = async () => {
    if (!generatedPath) return;
    try {
      const res = await api.savePath(generatedPath);
      if (res.success) {
        setSavedPaths([res.path, ...savedPaths.filter(p => p.id !== res.path.id)]);
        showToast('Learning path saved to your personal curricula!');
      }
    } catch (e) {
      showToast('Failed to save path', 'error');
    }
  };

  const handleDeletePath = async (id) => {
    try {
      await api.deletePath(id);
      setSavedPaths(savedPaths.filter((p) => p.id !== id));
      showToast('Path removed');
    } catch (e) {
      showToast('Failed to delete path', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <MapPin className="w-4 h-4" />
          <span>Curriculum Architect</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI-Powered Learning Path Generator
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Enter any topic, university syllabus, or career goal. Our AI analyzes prerequisite dependencies and structures an optimal step-by-step roadmap with mapped educational lectures.
        </p>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              What do you want to learn?
            </label>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. Machine Learning from scratch, Operating Systems for GATE, Full-Stack React & Node..."
              className="w-full bg-slate-950 text-sm text-slate-100 placeholder-slate-500 px-4 py-3.5 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Current Proficiency Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="Beginner">Beginner (Zero Prior Knowledge)</option>
                <option value="Intermediate">Intermediate (Know Basics)</option>
                <option value="Advanced">Advanced (Deep Dive & Systems)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Primary Learning Objective
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="Complete Course">Complete Comprehensive Course</option>
                <option value="Exam Preparation">University / GATE Exam Prep</option>
                <option value="Interview Preparation">Tech Interview & Coding Viva</option>
                <option value="Quick Learning">Fast Practical Crash Course</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!subjectInput.trim() || isGenerating}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Designing Custom Syllabus Tree...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Learning Path</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Path Output */}
      {generatedPath && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                PROPOSED SYLLABUS TREE
              </span>
              <h3 className="text-xl font-bold text-white">{generatedPath.title}</h3>
              <p className="text-xs text-slate-400">{generatedPath.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSavePath}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save to My Curricula</span>
              </button>

              <button
                onClick={() => navigate(`/?q=${encodeURIComponent(generatedPath.subject)}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                <span>Find Videos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stages Tree */}
          <div className="space-y-4">
            {generatedPath.stages.map((stg, i) => (
              <div
                key={stg.id || i}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                      {i + 1}
                    </span>
                    <span>{stg.name}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{stg.estimatedHours || 4} hours</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 pl-7">{stg.description}</p>

                {stg.topics && (
                  <div className="pl-7 pt-2 flex flex-wrap gap-2">
                    {stg.topics.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium"
                      >
                        • {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Learning Paths */}
      {savedPaths.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <span>Your Saved Learning Paths ({savedPaths.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPaths.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                      {p.level}
                    </span>
                    <button
                      onClick={() => handleDeletePath(p.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{p.stages?.length || 4} stages</span>
                  <button
                    onClick={() => navigate(`/?q=${encodeURIComponent(p.subject)}`)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
