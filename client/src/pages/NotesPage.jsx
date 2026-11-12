import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Pin,
  Download,
  Tag,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const NotesPage = () => {
  const { showToast } = useApp();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPinned, setFilterPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New note modal or form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState('General');

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getNotes();
      if (res.success) setNotes(res.notes);
    } catch (e) {
      console.warn('Notes load error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return;

    try {
      const res = await api.createNote({
        title: newTitle.trim() || 'Untitled Note',
        content: newContent,
        topicTitle: newTopic,
        tags: [newTopic, 'Student Ledger'],
      });
      if (res.success) {
        setNotes([res.note, ...notes]);
        setNewTitle('');
        setNewContent('');
        showToast('New note created!');
      }
    } catch (e) {
      showToast('Failed to create note', 'error');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const res = await api.updateNote(note.id, { isPinned: !note.isPinned });
      if (res.success) {
        setNotes(notes.map((n) => (n.id === note.id ? res.note : n)));
        showToast(res.note.isPinned ? '📌 Note pinned to top' : 'Note unpinned');
      }
    } catch (e) {
      showToast('Could not update pin status', 'error');
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

  const handleExportAll = () => {
    if (notes.length === 0) {
      showToast('No notes to export', 'info');
      return;
    }
    const markdown = `# LearnTube AI — Comprehensive Study Notes\n\nGenerated on: ${new Date().toLocaleString()}\n\n` +
      notes.map(n => `## ${n.title}\n**Topic:** ${n.topicTitle || 'General'} | **Date:** ${new Date(n.createdAt).toLocaleDateString()}\n\n${n.content}\n\n---`).join('\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LearnTube_All_Notes_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('All notes exported to Markdown!');
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topicTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPinned = !filterPinned || n.isPinned;
    return matchesSearch && matchesPinned;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <FileText className="w-4 h-4" />
            <span>Personal Knowledge Repository</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Smart Notes & Synopses
          </h1>
          <p className="text-xs text-slate-400">
            Organized study notes, lecture takeaways, and AI synthesized revision sheets across all courses
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export All (.md)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword or concept..."
            className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterPinned(!filterPinned)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterPinned
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned Only</span>
          </button>
        </div>
      </div>

      {/* Quick Create Note Card */}
      <form onSubmit={handleCreateNote} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Note Entry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title (e.g. Inode structure and block pointers)..."
            className="sm:col-span-2 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
          />

          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Topic tag (e.g. Operating Systems)..."
            className="bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write your study notes, insights, or code snippets here..."
          rows={3}
          className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 resize-y"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newTitle.trim() && !newContent.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            Save to Ledger
          </button>
        </div>
      </form>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all hover:-translate-y-0.5 ${
              note.isPinned
                ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {note.topicTitle || 'General'}
                    </span>
                    {note.isAiGenerated && (
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md border border-blue-500/20">
                        AI Note
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {note.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePin(note)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={note.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto pr-1">
                {note.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </span>

              {note.videoId && (
                <span className="text-emerald-400 font-medium">Linked to Lecture</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-3xl">
          No study notes match your filters. Create your first note above!
        </div>
      )}
    </div>
  );
};
