import React from 'react';
import {
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  FilePlus,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Eye,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoPlayer = ({
  video,
  module,
  course,
  transcript,
  isCompleted,
  onComplete,
  onOpenNotesWithTimestamp,
  onOpenQuiz,
}) => {
  const { bookmarks, toggleBookmark } = useApp();

  if (!video) {
    return (
      <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 text-slate-500">
        No video selected
      </div>
    );
  }

  const isBookmarked = bookmarks.some((b) => b.id === video.id);

  return (
    <div className="space-y-4">
      {/* YouTube IFrame Embed */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?enablejsapi=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        ></iframe>
      </div>

      {/* Video Details & Actions Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20">
                {module?.title || course?.title || 'Lecture'}
              </span>
              {video.badge && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 font-medium border border-blue-500/20">
                  {video.badge}
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {video.duration || 'Full Lecture'}
              </span>
              {video.views && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  {video.views} views
                </span>
              )}
            </div>

            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
              {video.title}
            </h1>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Channel:</span>
              <span className="text-slate-200 font-medium">{video.channel}</span>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-emerald-400 inline-flex items-center gap-0.5 transition-colors"
                title="Open on YouTube"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Mark Complete */}
            <button
              onClick={onComplete}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-600/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete (+100 XP)'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(video)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isBookmarked ? 'Saved in Bookmarks' : 'Bookmark this video'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Add Note */}
            <button
              onClick={onOpenNotesWithTimestamp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title="Add timestamped note"
            >
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span>Add Note</span>
            </button>

            {/* Take Quiz */}
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-400 transition-colors"
              title="Practice MCQs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Practice Quiz</span>
            </button>
          </div>
        </div>

        {/* Honest Transcript Availability Banner */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {transcript?.canGroundAi ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Transcript Verified • AI is Grounded in Lecture Timestamps</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                <ShieldAlert className="w-4 h-4" />
                <span>Transcripts Unavailable • AI Grounded in University Syllabus Knowledge</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Official Embed • Adheres to Platform Policy
          </span>
        </div>
      </div>
    </div>
  );
};
