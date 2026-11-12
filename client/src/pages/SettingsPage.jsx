import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Bot,
  Key,
  ShieldCheck,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [preferredLanguage, setPreferredLanguage] = useState(
    settings?.preferredLanguage || 'English'
  );
  const [tutorLanguage, setTutorLanguage] = useState(settings?.tutorLanguage || 'English');
  const [tutorPersona, setTutorPersona] = useState(settings?.tutorPersona || 'balanced');
  const [geminiApiKey, setGeminiApiKey] = useState(settings?.geminiApiKey || '');
  const [youtubeApiKey, setYoutubeApiKey] = useState(settings?.youtubeApiKey || '');

  const languages = [
    { code: 'English', label: 'English' },
    { code: 'Hindi', label: 'हिंदी (Hindi)' },
    { code: 'Spanish', label: 'Español (Spanish)' },
    { code: 'French', label: 'Français (French)' },
    { code: 'German', label: 'Deutsch (German)' },
    { code: 'Tamil', label: 'தமிழ் (Tamil)' },
    { code: 'Telugu', label: 'తెలుగు (Telugu)' },
    { code: 'Bengali', label: 'বাংলা (Bengali)' },
    { code: 'Japanese', label: '日本語 (Japanese)' },
    { code: 'Korean', label: '한국어 (Korean)' },
  ];

  const personas = [
    {
      id: 'balanced',
      title: 'Balanced Academic Mentor',
      desc: 'Patient, structured, clear analogies, and exam focused. (Recommended)',
    },
    {
      id: 'strict_professor',
      title: 'Strict University Professor',
      desc: 'Formal academic tone, rigorous mathematical definitions, demands proof.',
    },
    {
      id: 'socratic_mentor',
      title: 'Socratic Inquiry Guide',
      desc: 'Rarely gives answers immediately; asks guiding questions so you discover concepts.',
    },
    {
      id: 'friendly_peer',
      title: 'Senior Engineering Peer',
      desc: 'Relatable, colloquial, shares industry war stories and interview traps.',
    },
    {
      id: 'eli5',
      title: 'ELI5 (Explain Like I’m 5)',
      desc: 'Zero complex jargon. Pure everyday analogies and intuitive mental models.',
    },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      preferredLanguage,
      tutorLanguage,
      tutorPersona,
      geminiApiKey: geminiApiKey.trim(),
      youtubeApiKey: youtubeApiKey.trim(),
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LearnTube_Settings_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Settings exported to JSON file!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Settings className="w-4 h-4" />
          <span>Platform Preferences & Integration Keys</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Settings & Language Customization
        </h1>
        <p className="text-xs text-slate-400">
          Configure your multilingual learning environment, AI tutor teaching style, and optional API keys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Multilingual Learning Configuration */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Multilingual Learning & Content Translation</span>
          </div>
          <p className="text-xs text-slate-400">
            LearnTube AI adapts summaries, flashcards, and tutor answers into your native tongue while preserving standard engineering terminology.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Preferred Study Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                AI Tutor Response Language
              </label>
              <select
                value={tutorLanguage}
                onChange={(e) => setTutorLanguage(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Tutor Persona */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Tutor Persona & Teaching Methodology</span>
          </div>
          <p className="text-xs text-slate-400">
            Select the pedagogical tone that matches your personal study preferences.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {personas.map((p) => {
              const isSelected = tutorPersona === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setTutorPersona(p.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Custom API Keys */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Key className="w-4 h-4 text-amber-400" />
              <span>External API Credentials (Optional)</span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Zero Config Out of the Box
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            💡 <strong>Notice:</strong> LearnTube AI operates completely out of the box with its built-in Smart Educational Engine and Curated University Catalog. Providing your own keys is 100% optional if you want unlimited custom live YouTube search and personal Gemini 1.5 quota.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use LearnTube Educational Engine)"
                className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-600 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                YouTube Data API v3 Key
              </label>
              <input
                type="password"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use Curated University Catalog)"
                className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-600 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Settings JSON</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
