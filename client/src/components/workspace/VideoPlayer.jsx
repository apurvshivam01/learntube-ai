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
      <div className="aspect-video bg-[#111A2B] rounded-2xl flex items-center justify-center border border-[#22304A] text-[#64748B]">
        No video selected
      </div>
    );
  }

  const isBookmarked = bookmarks.some((b) => b.id === video.id);

  return (
    <div className="space-y-4">
      {/* YouTube IFrame Embed */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#22304A] shadow-xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?enablejsapi=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        ></iframe>
      </div>

      {/* Video Details & Actions Bar */}
      <div className="p-4 rounded-2xl bg-[#111A2B] border border-[#22304A] space-y-3">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20">
                {module?.title || course?.title || 'Lecture'}
              </span>
              {video.badge && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20">
                  {video.badge}
                </span>
              )}
              <span className="flex items-center gap-1 text-[#94A3B8]">
                <Clock className="w-3.5 h-3.5" />
                {video.duration || 'Full Lecture'}
              </span>
              {video.views && (
                <span className="flex items-center gap-1 text-[#94A3B8]">
                  <Eye className="w-3.5 h-3.5" />
                  {video.views} views
                </span>
              )}
            </div>

            <h1 className="text-lg md:text-xl font-bold font-heading text-white tracking-tight leading-snug">
              {video.title}
            </h1>

            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5">
              <span>Channel:</span>
              <span className="text-[#F8FAFC] font-medium">{video.channel}</span>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#64748B] hover:text-teal-400 inline-flex items-center gap-0.5 transition-colors"
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40'
                  : 'bg-teal-500 hover:bg-teal-400 text-[#070B14] font-semibold'
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
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-[#162033] border-[#22304A] text-[#94A3B8] hover:text-white'
              }`}
              title={isBookmarked ? 'Saved in Bookmarks' : 'Bookmark this video'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Add Note */}
            <button
              onClick={onOpenNotesWithTimestamp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#162033] hover:bg-[#1f2d47] border border-[#22304A] text-xs font-medium text-[#F8FAFC] transition-colors"
              title="Add timestamped note"
            >
              <FilePlus className="w-4 h-4 text-teal-400" />
              <span>Add Note</span>
            </button>

            {/* Take Quiz */}
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-400 transition-colors"
              title="Practice MCQs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Practice Quiz</span>
            </button>
          </div>
        </div>

        {/* Honest Transcript Availability Banner */}
        <div className="pt-2 border-t border-[#22304A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {transcript?.canGroundAi ? (
              <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Transcript Verified • AI Grounded in Lecture Timestamps</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <ShieldAlert className="w-4 h-4" />
                <span>Transcripts Unavailable • AI Grounded in University Syllabus Knowledge</span>
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#64748B] font-mono">
            Official Embed • Platform Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
