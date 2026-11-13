import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  GraduationCap,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const { mastery } = useApp();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recommended learning paths fallback / base data
  const recommendedPaths = [
    {
      id: 'operating-systems',
      title: 'Operating Systems',
      creator: 'MIT / Neso Academy',
      lessons: '24 lessons',
      duration: '12h 40m',
      difficulty: 'Intermediate',
      matchScore: '96% match',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      description: 'Processes, CPU scheduling, synchronization primitives, virtual memory, paging, and storage architectures.',
      category: 'Computer Science',
      firstVideoId: 'vBURTt97EkA',
    },
    {
      id: 'data-structures-and-algorithms',
      title: 'Data Structures & Algorithms',
      creator: 'University / Abdul Bari',
      lessons: '36 lessons',
      duration: '18h 00m',
      difficulty: 'Beginner → Advanced',
      matchScore: '94% match',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      description: 'Asymptotic complexity, linked lists, trees, graphs, dynamic programming, and high-frequency interview patterns.',
      category: 'Algorithms',
      firstVideoId: '9TlHvipP5yA',
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      creator: 'Stanford Online / 3Blue1Brown',
      lessons: '30 lessons',
      duration: '15h 10m',
      difficulty: 'Intermediate',
      matchScore: '88% match',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      description: 'Supervised learning, neural networks, gradient descent, backpropagation, and deep representation models.',
      category: 'Artificial Intelligence',
      firstVideoId: 'fNk_zzaMoSs',
    },
    {
      id: 'computer-networks',
      title: 'Computer Networks',
      creator: 'Stanford / Gate Smashers',
      lessons: '28 lessons',
      duration: '14h 20m',
      difficulty: 'All Levels',
      matchScore: '84% match',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
      description: 'OSI reference model, TCP/IP congestion control, subnet routing, DNS, and modern network protocols.',
      category: 'Systems',
      firstVideoId: 'IPvYjXCsTg8',
    },
  ];

  const popularTopics = [
    { label: 'Operating Systems', query: 'Operating Systems' },
    { label: 'DSA', query: 'Data Structures and Algorithms' },
    { label: 'DBMS', query: 'DBMS' },
    { label: 'Computer Networks', query: 'Computer Networks' },
    { label: 'Machine Learning', query: 'Machine Learning' },
    { label: 'Python', query: 'Python' },
    { label: 'React', query: 'React' },
    { label: 'Calculus', query: 'Calculus' },
  ];

  const levels = [
    { id: 'all', label: 'All' },
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' },
  ];

  const goals = [
    { id: 'all', label: 'Complete Course' },
    { id: 'Exam Preparation', label: 'Exam Prep' },
    { id: 'Interview Preparation', label: 'Interview Prep' },
    { id: 'Quick Learning', label: 'Quick Learning' },
  ];

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.getCourses();
        if (res.success && res.courses?.length) {
          setCourses(res.courses);
        } else {
          setCourses(recommendedPaths);
        }
      } catch (e) {
        console.warn('Courses load error, using default catalog:', e.message);
        setCourses(recommendedPaths);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle Search Execution when URL query changes
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

  const handleTopicClick = (topicQuery) => {
    setSearchQuery(topicQuery);
    executeSearch(topicQuery, selectedLevel, selectedGoal);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#22304A] bg-gradient-to-b from-[#0B1220] via-[#070B14] to-[#070B14]">
        <div className="max-w-[1100px] mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2B] border border-[#22304A] text-teal-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span>YOUR PERSONAL LEARNING HUB</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold font-heading text-[#F8FAFC] tracking-tight leading-[1.12]">
            Learn from the best.<br />
            <span className="text-teal-400">Master at your own pace.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#94A3B8] leading-relaxed font-normal">
            Discover structured learning paths from high-quality YouTube courses, university lectures, and trusted educators — then learn, practice, and track your progress in one place.
          </p>

          {/* ========================================================= */}
          {/* 2. PRIMARY SEARCH BAR */}
          {/* ========================================================= */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-[#111A2B] border border-[#22304A] hover:border-[#324466] focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-xl sm:rounded-2xl transition-all duration-150 h-14 sm:h-[60px] px-3 shadow-lg"
            >
              <Search className="w-5 h-5 text-[#64748B] ml-2 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full bg-transparent text-sm sm:text-base text-[#F8FAFC] placeholder-[#64748B] pl-3 pr-2 focus:outline-none"
                aria-label="What do you want to learn?"
              />
              <button
                type="submit"
                className="shrink-0 h-10 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-teal-500 hover:bg-teal-400 text-[#070B14] font-semibold text-xs sm:text-sm transition-colors duration-150 flex items-center gap-1.5"
              >
                <span>Find Courses</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </form>
          </div>

          {/* ========================================================= */}
          {/* 3. POPULAR TOPICS CHIPS */}
          {/* ========================================================= */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pt-1 text-xs">
            <span className="text-xs text-[#64748B] font-medium mr-1">Popular:</span>
            {popularTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTopicClick(item.query)}
                className="px-2.5 py-1 rounded-lg bg-[#111A2B] hover:bg-[#162033] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#22304A] hover:border-[#324466] transition-colors duration-150 text-xs font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* 4. LEVEL AND LEARNING GOAL FILTERS */}
          {/* ========================================================= */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs">
            {/* Level Group */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Level</span>
              <div className="flex bg-[#0B1220] border border-[#22304A] p-0.5 rounded-lg">
                {levels.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        setSelectedLevel(lvl.id);
                        if (searchQuery.trim()) executeSearch(searchQuery, lvl.id, selectedGoal);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors duration-150 ${
                        isSelected
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent font-medium'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Learning Goal Group */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Learning Goal</span>
              <div className="flex bg-[#0B1220] border border-[#22304A] p-0.5 rounded-lg">
                {goals.map((g) => {
                  const isSelected = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(g.id);
                        if (searchQuery.trim()) executeSearch(searchQuery, selectedLevel, g.id);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors duration-150 ${
                        isSelected
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent font-medium'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ========================================================= */}
        {/* ACTIVE SEARCH RESULTS (IF QUERY ACTIVE) */}
        {/* ========================================================= */}
        {searchResults && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#22304A] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
                  <span>Search Results for "{searchResults.query}"</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold">
                    {searchResults.totalResults} found
                  </span>
                </h2>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Verified curriculum paths, lecture videos, and academic courseware
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchResults(null);
                  setSearchQuery('');
                }}
                className="text-xs text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg border border-[#22304A] hover:bg-[#111A2B] transition-colors"
              >
                Clear Search
              </button>
            </div>

            {/* Courses / Curricula Results */}
            {searchResults.courses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  Curated Curricula
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.courses.map((c) => (
                    <SaaSCourseCard key={c.id} course={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Video Lecture Results */}
            {searchResults.videos.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Matching Lecture Videos
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
                      className="group p-3 rounded-xl bg-[#111A2B] border border-[#22304A] hover:border-[#324466] hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-[#070B14]">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                            {v.duration}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-teal-400">
                            {v.badge || 'Verified Lecture'}
                          </span>
                          <h4 className="text-xs font-semibold text-white group-hover:text-teal-300 transition-colors line-clamp-2 mt-0.5">
                            {v.title}
                          </h4>
                          <p className="text-[11px] text-[#94A3B8] mt-1 truncate">
                            {v.channel}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-[#22304A] flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>{v.views || 'Verified'} views</span>
                        <span className="text-teal-400 font-medium group-hover:underline flex items-center gap-0.5">
                          Open →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* DEFAULT VIEW: RECOMMENDED PATHS, WORKFLOW, CATALOG */}
        {/* ========================================================= */}
        {!searchResults && (
          <>
            {/* ========================================================= */}
            {/* 5. RECOMMENDED LEARNING PATHS (SECTION 8 & 9) */}
            {/* ========================================================= */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#22304A] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Verified Core Sequences</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                    Recommended learning paths
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                    Structured university syllabi mapped to the finest creators and professor lectures
                  </p>
                </div>

                <Link
                  to="/discovery"
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 shrink-0 self-start sm:self-auto"
                >
                  <span>View all syllabi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 Cards Responsive Grid: desktop 4, tablet 2, mobile 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommendedPaths.map((path) => (
                  <article
                    key={path.id}
                    className="saas-card group flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-[#070B14]">
                        <img
                          src={path.thumbnail}
                          alt={path.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111A2B] via-transparent to-transparent opacity-90"></div>

                        {/* Badges on Thumbnail */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-[#070B14]/80 backdrop-blur-sm text-[10px] font-semibold text-teal-300 border border-teal-500/20">
                            {path.matchScore}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#070B14]/80 backdrop-blur-sm text-[10px] font-medium text-[#94A3B8]">
                            {path.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2">
                        <span className="text-[11px] font-medium text-[#64748B] block truncate">
                          {path.creator}
                        </span>
                        <h3 className="text-base font-semibold text-[#F8FAFC] group-hover:text-teal-300 transition-colors line-clamp-1">
                          {path.title}
                        </h3>
                        <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                          {path.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & View Path Button */}
                    <div className="p-4 pt-0 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#64748B] border-t border-[#22304A] pt-2.5">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-teal-400" />
                          <span>{path.lessons}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{path.duration}</span>
                        </span>
                      </div>

                      <Link
                        to={`/learn/${path.id}/${path.firstVideoId}`}
                        className="w-full py-2 rounded-xl bg-[#162033] hover:bg-teal-500 text-slate-200 hover:text-[#070B14] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#22304A] hover:border-teal-400 transition-colors duration-150"
                      >
                        <span>View Path</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 6. LEARNTUBE WORKFLOW STRIP (HIERARCHY & IDENTITY) */}
            {/* ========================================================= */}
            <section className="rounded-2xl bg-[#0B1220] border border-[#22304A] p-6 sm:p-8">
              <div className="max-w-3xl mb-6">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  The Learning Architecture
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                  How LearnTube turns YouTube into a personal university
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  A high-yield alternative to passive video watching. Move from discovery to verified retention in four deliberate steps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: '01',
                    title: 'Curated Video Lectures',
                    desc: 'Zero entertainment distraction. Mapped strictly to accredited university syllabi and verified educators.',
                  },
                  {
                    step: '02',
                    title: 'Structured Syllabi',
                    desc: 'Sequential modules with time estimates, prerequisites, and clean chapter breakdowns.',
                  },
                  {
                    step: '03',
                    title: 'Socratic AI Tutoring',
                    desc: 'Ask questions without answers being spoonfed. Gain intuition through guided conceptual questioning.',
                  },
                  {
                    step: '04',
                    title: 'Quizzes & Retention',
                    desc: 'Active recall flashcards, timed test mode simulations, and real-time knowledge radar metrics.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#111A2B] border border-[#22304A] space-y-2"
                  >
                    <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      {item.step}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1">{item.title}</h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 7. CUSTOM CURRICULUM BANNER */}
            {/* ========================================================= */}
            <section className="rounded-2xl bg-[#111A2B] border border-[#22304A] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Curriculum Engine</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Preparing for a specific exam or technical interview?
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                  Enter your target topic (e.g. <em>"Distributed Systems for Senior Backend Interviews"</em> or <em>"GATE CS Computer Networks"</em>) and our curriculum engine will assemble a focused sequential roadmap.
                </p>
              </div>

              <Link
                to="/path-generator"
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#070B14] font-semibold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-colors duration-150"
              >
                <span>Generate Custom Path</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>

            {/* ========================================================= */}
            {/* 8. COMPLETE COURSE CATALOG */}
            {/* ========================================================= */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#22304A] pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-teal-400" />
                    <span>Curated Core Engineering Courses</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Full semester university courses with integrated lecture workspaces
                  </p>
                </div>

                <Link
                  to="/discovery"
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                >
                  <span>Explore channels</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <SaaSCourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 9. TRUSTED INSTITUTIONS & CHANNELS */}
            {/* ========================================================= */}
            <section className="p-6 rounded-2xl bg-[#0B1220] border border-[#22304A] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>Trusted Academic Institutions & Master Educators</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    No clickbait. LearnTube indexes officially licensed open courseware and high-yield engineering educators.
                  </p>
                </div>

                <Link
                  to="/discovery"
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium"
                >
                  View all verified sources →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { name: 'MIT OpenCourseWare', tag: 'Algorithms & Architecture', uni: 'MIT' },
                  { name: 'Stanford Online', tag: 'Machine Learning & Systems', uni: 'Stanford' },
                  { name: 'Harvard CS50', tag: 'Foundational CS & C', uni: 'Harvard' },
                  { name: 'Gate Smashers', tag: 'Core Engineering & GATE', uni: 'Top Tech' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#111A2B] border border-[#22304A] hover:border-[#324466] transition-colors flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
                        {item.uni}
                      </span>
                      <h4 className="text-xs font-semibold text-[#F8FAFC] mt-0.5">{item.name}</h4>
                    </div>
                    <span className="text-[11px] text-[#64748B] font-medium">{item.tag}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

// Polished SaaS Course Card Subcomponent
const SaaSCourseCard = ({ course }) => {
  const courseId = course.id;
  const initialVideoId =
    course.firstVideoId ||
    course.modules?.[0]?.videos?.[0]?.id ||
    course.modules?.[0]?.defaultVideoId ||
    '';

  const linkTarget = initialVideoId
    ? `/learn/${courseId}/${initialVideoId}`
    : `/learn/${courseId}`;

  return (
    <article className="saas-card group flex flex-col justify-between overflow-hidden">
      <div>
        {/* Thumbnail Header */}
        <div className="relative aspect-[16/9] overflow-hidden bg-[#070B14]">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111A2B] via-transparent to-transparent opacity-90"></div>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#070B14]/80 backdrop-blur-sm text-[10px] font-semibold text-teal-300 border border-teal-500/20">
              {course.category || 'Computer Science'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#070B14]/80 backdrop-blur-sm text-[10px] font-medium text-[#94A3B8]">
              {course.difficulty || 'All Levels'}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-3 right-3">
            <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
              {course.university || course.creator}
            </span>
            <h3 className="text-base font-semibold text-[#F8FAFC] group-hover:text-teal-300 transition-colors leading-snug line-clamp-1">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
            {course.tagline || course.description}
          </p>

          <div className="flex items-center justify-between text-xs text-[#64748B] border-t border-[#22304A] pt-2.5">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>{course.modulesCount || course.modules?.length || 10} Modules</span>
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
          to={linkTarget}
          className="w-full py-2.5 rounded-xl bg-[#162033] hover:bg-teal-500 text-slate-200 hover:text-[#070B14] font-semibold text-xs flex items-center justify-center gap-2 border border-[#22304A] hover:border-teal-400 transition-colors duration-150"
        >
          <span>Open Course Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
