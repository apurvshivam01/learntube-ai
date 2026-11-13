import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Bot,
  Key,
  Save,
  Download,
  CheckCircle2,
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
    showToast('Platform preferences saved successfully!');
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
      <div className="space-y-2 border-b border-[#22304A] pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Platform Preferences & Integration Keys</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
          Settings & Language Customization
        </h1>
        <p className="text-xs text-[#94A3B8]">
          Configure your multilingual learning environment, AI tutor teaching style, and optional API keys.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Multilingual Learning Configuration */}
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-5">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Globe className="w-4 h-4 text-teal-400" />
            <span>Multilingual Learning & Content Translation</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            LearnTube adapts summaries, flashcards, and tutor answers into your native tongue while preserving standard engineering terminology.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-2">
                Preferred Study Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-2">
                AI Tutor Response Language
              </label>
              <select
                value={tutorLanguage}
                onChange={(e) => setTutorLanguage(e.target.value)}
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500"
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
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Bot className="w-4 h-4 text-teal-400" />
            <span>AI Tutor Persona & Teaching Methodology</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Select the pedagogical tone that matches your personal study preferences.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {personas.map((p) => {
              const isSelected = tutorPersona === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setTutorPersona(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                      : 'bg-[#0B1220] border-[#22304A] hover:border-[#324466]'
                  }`}
                >
                  <div className="mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#64748B]"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{p.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Custom API Keys */}
        <div className="p-6 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Key className="w-4 h-4 text-amber-400" />
              <span>External API Credentials (Optional)</span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20">
              Zero Config Out of the Box
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#22304A] text-xs text-[#94A3B8] leading-relaxed">
            💡 <strong>Notice:</strong> LearnTube operates out of the box with its built-in Curriculum Engine and Curated University Catalog. Providing your own keys is 100% optional if you want custom live YouTube search and personal Gemini 1.5 quota.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-1.5">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use LearnTube Engine)"
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] placeholder-[#64748B] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-1.5">
                YouTube Data API v3 Key
              </label>
              <input
                type="password"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use Curated Catalog)"
                className="w-full bg-[#0B1220] text-xs text-[#F8FAFC] placeholder-[#64748B] px-3.5 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111A2B] hover:bg-[#162033] border border-[#22304A] hover:border-[#324466] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Settings JSON</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#070B14] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
