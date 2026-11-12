import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from '../components/workspace/VideoPlayer';
import { CurriculumSidebar } from '../components/workspace/CurriculumSidebar';
import { AiTutorSidebar } from '../components/workspace/AiTutorSidebar';
import { WorkspaceTabs } from '../components/workspace/WorkspaceTabs';

export const WorkspacePage = () => {
  const { courseId, videoId } = useParams();
  const navigate = useNavigate();
  const { mastery, completeTopic } = useApp();

  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workspaceTab, setWorkspaceTab] = useState('summary');

  // Load Course and Video Details
  useEffect(() => {
    const loadWorkspace = async () => {
      setIsLoading(true);
      try {
        const targetCourseId = courseId || 'operating-systems';
        const courseRes = await api.getCourse(targetCourseId);

        if (courseRes.success && courseRes.course) {
          const c = courseRes.course;
          setCourse(c);

          // Find the selected video or default to first video
          let selectedVideoId = videoId;
          let currentMod = null;
          let currentVid = null;

          if (selectedVideoId) {
            for (const m of c.modules) {
              const v = m.videos.find((item) => item.id === selectedVideoId);
              if (v) {
                currentMod = m;
                currentVid = v;
                break;
              }
            }
          }

          // Fallback to first module and default video
          if (!currentVid && c.modules.length > 0) {
            currentMod = c.modules[0];
            currentVid = currentMod.videos[0];
            selectedVideoId = currentVid.id;
          }

          setActiveModule(currentMod);
          setActiveVideo(currentVid);

          // Fetch transcript for this video
          if (currentVid) {
            const tRes = await api.getTranscript(currentVid.id, currentVid.title);
            if (tRes.success) {
              setTranscript(tRes.transcript);
            }
          }
        }
      } catch (err) {
        console.warn('Workspace loading error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspace();
  }, [courseId, videoId]);

  const handleSelectVideo = async (moduleId, newVideoId) => {
    navigate(`/learn/${courseId || 'operating-systems'}/${newVideoId}`);
  };

  const handleCompleteActiveTopic = () => {
    if (activeModule) {
      completeTopic(activeModule.id, course?.title || 'Computer Science');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <span className="font-semibold text-slate-300">
          Preparing distraction-free learning environment...
        </span>
      </div>
    );
  }

  const isCompleted = (mastery?.completedTopics || []).includes(activeModule?.id);

  return (
    <div className="max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-6">
      {/* Workspace Subheader / Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">{course?.title}</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">{activeModule?.title}</span>
        </div>
      </div>

      {/* 3-Column Studio Workspace Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* LEFT COLUMN: Curriculum Syllabus Tree */}
        <CurriculumSidebar
          course={course}
          activeModuleId={activeModule?.id}
          activeVideoId={activeVideo?.id}
          onSelectVideo={handleSelectVideo}
        />

        {/* CENTER COLUMN: Video Player + Workspace Tabbed Ledger */}
        <main className="flex-1 min-w-0 space-y-6 w-full">
          <VideoPlayer
            video={activeVideo}
            module={activeModule}
            course={course}
            transcript={transcript}
            isCompleted={isCompleted}
            onComplete={handleCompleteActiveTopic}
            onOpenNotesWithTimestamp={() => setWorkspaceTab('notes')}
            onOpenQuiz={() => setWorkspaceTab('quiz')}
          />

          {/* Bottom Tabs: Notes, Summary, Flashcards, Quiz, Socratic */}
          <WorkspaceTabs
            topic={activeModule?.title || course?.title}
            video={activeVideo}
            module={activeModule}
            course={course}
            transcript={transcript}
            initialActiveTab={workspaceTab}
          />
        </main>

        {/* RIGHT COLUMN: AI Tutor Sidebar */}
        <AiTutorSidebar
          topic={activeModule?.title || course?.title}
          videoTitle={activeVideo?.title}
          transcript={transcript}
        />
      </div>
    </div>
  );
};
