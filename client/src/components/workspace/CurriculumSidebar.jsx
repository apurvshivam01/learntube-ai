import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Users,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CurriculumSidebar = ({
  course,
  activeModuleId,
  activeVideoId,
  onSelectVideo,
}) => {
  const { mastery } = useApp();
  const [expandedModules, setExpandedModules] = useState({});

  if (!course) {
    return (
      <div className="p-4 text-xs text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
        Curriculum not loaded
      </div>
    );
  }

  const toggleExpand = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const completedCount = course.modules.filter((m) =>
    (mastery?.completedTopics || []).includes(m.id)
  ).length;

  const progressPercent = Math.round((completedCount / course.modules.length) * 100);

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-[750px] overflow-hidden">
      {/* Course Header */}
      <div className="pb-3 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Course Curriculum</span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {completedCount}/{course.modules.length} Done ({progressPercent}%)
          </span>
        </div>

        <h2 className="text-sm font-bold text-white tracking-tight line-clamp-1">
          {course.title}
        </h2>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {course.modules.map((mod, index) => {
          const isCompleted = (mastery?.completedTopics || []).includes(mod.id);
          const isActiveModule = mod.id === activeModuleId;
          const isExpanded = expandedModules[mod.id] ?? isActiveModule;

          return (
            <div
              key={mod.id}
              className={`rounded-xl border transition-all ${
                isActiveModule
                  ? 'bg-slate-800/80 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Module Header */}
              <div
                onClick={() => toggleExpand(mod.id)}
                className="p-3 cursor-pointer flex items-start gap-2.5 select-none"
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={`text-xs font-semibold leading-snug line-clamp-1 ${
                        isActiveModule ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {mod.title}
                    </h3>
                    <span className="text-slate-500 hover:text-slate-300">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {mod.description}
                  </p>
                </div>
              </div>

              {/* Module Videos / Alternatives List */}
              {isExpanded && (
                <div className="px-2 pb-2.5 pt-1 space-y-1 border-t border-slate-800/60 bg-slate-950/40 rounded-b-xl">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-0.5">
                    Available Teachers & Explanations:
                  </div>

                  {mod.videos.map((v) => {
                    const isVideoActive = v.id === activeVideoId;

                    return (
                      <button
                        key={v.id}
                        onClick={() => onSelectVideo(mod.id, v.id)}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-2 text-xs transition-all ${
                          isVideoActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Play
                            className={`w-3 h-3 shrink-0 ${
                              isVideoActive ? 'fill-emerald-400 text-emerald-400' : 'text-slate-500'
                            }`}
                          />
                          <div className="min-w-0">
                            <p
                              className={`text-xs truncate ${
                                isVideoActive ? 'font-semibold text-emerald-300' : 'text-slate-300'
                              }`}
                            >
                              {v.title}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {v.channel} • {v.duration}
                            </p>
                          </div>
                        </div>

                        {v.type && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80 shrink-0">
                            {v.type}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
