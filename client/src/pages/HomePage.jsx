import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  Flame,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Compass,
  Star,
  Users,
  Play,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mastery } = useApp();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const quickSubjects = [
    'Operating Systems',
    'Data Structures and Algorithms',
    'DBMS',
    'Computer Networks',
    'Machine Learning',
    'Python',
    'React',
    'Calculus',
    'GATE CS',
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' },
  ];

  const goals = [
    { id: 'all', label: 'All Goals' },
    { id: 'Complete Course', label: 'Complete Course' },
    { id: 'Exam Preparation', label: 'Exam Prep' },
    { id: 'Interview Preparation', label: 'Interview Prep' },
    { id: 'Quick Learning', label: 'Quick Learning' },
  ];

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.getCourses();
        if (res.success) setCourses(res.courses);
      } catch (e) {
        console.warn('Courses load error:', e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle Search Execution
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      executeSearch(q, selectedLevel, selectedGoal);
    } else {
      setSearchResults(null);
    }
  }, [searchParams]);

  const executeSearch = async (queryText, level, goal) => {
    if (!queryText.trim()) {
      setSearchResults(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.search({
        q: queryText,
        level: level === 'all' ? '' : level,
        goal: goal === 'all' ? '' : goal,
      });
      if (res.success) {
        setSearchResults(res);
      }
    } catch (e) {
      console.warn('Search error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch(searchQuery.trim(), selectedLevel, selectedGoal);
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turn YouTube into Your Personal University</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Stop Browsing YouTube.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">
              Start Mastering
            </span>{' '}
            Computer Science.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            LearnTube maps any subject to top university lectures and verified creators, structuring them into a distraction-free workspace with Socratic AI tutoring, smart notes, and exam practice.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any subject (e.g. Operating Systems, DBMS, Machine Learning, GATE)..."
              className="w-full bg-slate-900 text-sm sm:text-base text-slate-100 placeholder-slate-500 pl-12 pr-28 py-3.5 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xl transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30"
            >
              Explore Path
            </button>
          </form>

          {/* Quick Subject Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-slate-500 font-medium mr-1">Popular:</span>
            {quickSubjects.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(sub);
                  executeSearch(sub, selectedLevel, selectedGoal);
                }}
                className="text-xs px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Level & Goal Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800/60 max-w-2xl mx-auto text-xs">
            {/* Level */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Level:</span>
              <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setSelectedLevel(lvl.id);
                      if (searchQuery.trim()) executeSearch(searchQuery, lvl.id, selectedGoal);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selectedLevel === lvl.id
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Goal:</span>
              <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGoal(g.id);
                      if (searchQuery.trim()) executeSearch(searchQuery, selectedLevel, g.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selectedGoal === g.id
                        ? 'bg-blue-500/20 text-blue-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ========================================================= */}
        {/* SEARCH RESULTS VIEW (IF ACTIVE SEARCH) */}
        {/* ========================================================= */}
        {searchResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Search Results for "{searchResults.query}"</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {searchResults.totalResults} results
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Showing structured courses, educational videos, and verified university channels
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchResults(null);
                  setSearchQuery('');
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Search
              </button>
            </div>

            {/* Curated Courses Match */}
            {searchResults.courses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Structured Curricula
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.courses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Individual Video Matches */}
            {searchResults.videos.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Relevant Lecture Videos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {searchResults.videos.map((v, i) => (
                    <Link
                      key={i}
                      to={
                        v.courseId
                          ? `/learn/${v.courseId}/${v.id}`
                          : `/learn/general/${v.id}`
                      }
                      className="group p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                            {v.duration}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {v.badge || 'Lecture'}
                          </span>
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mt-0.5">
                            {v.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 truncate">
                            {v.channel}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{v.views || 'Verified'} views</span>
                        <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                          Open in Workspace →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* DEFAULT VIEW: FEATURED COURSES & PLATFORM HIGHLIGHTS */}
        {/* ========================================================= */}
        {!searchResults && (
          <>
            {/* AI Learning Path Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Curriculum Engine</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Have a specific goal or university exam?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                  Tell our AI what you want to learn (e.g. <em>"Master Computer Networks for GATE CS in 4 weeks"</em>) and generate a step-by-step roadmap mapped to high-yield YouTube lectures.
                </p>
              </div>

              <Link
                to="/path-generator"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <span>Generate Custom Path</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Curated University Courses Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <span>Curated Core Engineering Courses</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Complete university syllabi mapped to the finest creators and professor lectures
                  </p>
                </div>

                <Link
                  to="/discovery"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Explore Universities & Creators</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Discovery Channels Preview */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Learn From The World's Finest Institutions</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    No low-effort clickbait. LearnTube prioritizes verified university courseware and acclaimed engineering educators.
                  </p>
                </div>

                <Link
                  to="/discovery"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  View All Channels →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { name: 'MIT OpenCourseWare', tag: 'Algorithms & OS', uni: 'MIT' },
                  { name: 'Stanford Online', tag: 'Machine Learning', uni: 'Stanford' },
                  { name: 'Harvard CS50', tag: 'CS Foundations', uni: 'Harvard' },
                  { name: 'Gate Smashers', tag: 'Core Engineering', uni: 'Top Tech' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {item.uni}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 mt-0.5">{item.name}</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Course Card Subcomponent
const CourseCard = ({ course }) => {
  return (
    <div className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Thumbnail Header */}
        <div className="relative h-44 overflow-hidden bg-slate-950">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              {course.category}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-medium text-slate-300">
              {course.difficulty}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {course.university}
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {course.tagline || course.description}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-2.5">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{course.modulesCount || 10} Modules</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration || '24 hrs'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <Link
          to={`/learn/${course.id}`}
          className="w-full py-2.5 rounded-xl bg-slate-800 group-hover:bg-emerald-600 text-slate-200 group-hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <span>Open Course Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
