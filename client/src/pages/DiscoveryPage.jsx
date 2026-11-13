import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';

export const DiscoveryPage = () => {
  const [channels, setChannels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const res = await api.getChannels();
        if (res.success) setChannels(res.channels);
      } catch (e) {
        console.warn('Channels load error:', e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadChannels();
  }, []);

  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'Systems', label: 'Systems & OS' },
    { id: 'Algorithms', label: 'Algorithms' },
    { id: 'AI', label: 'AI & Machine Learning' },
    { id: 'Engineering', label: 'Software Engineering' },
  ];

  const filtered = channels.filter((ch) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (ch.category && ch.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesQuery =
      !filterQuery ||
      ch.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ch.university.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Verified University & Channel Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
          Learn From The World's Top Classrooms
        </h1>
        <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
          LearnTube curates courses directly from verified open courseware programs, Ivy League institutions, and acclaimed engineering educators. No clickbait or low-effort filler.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1220] border border-[#22304A]">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search institution or instructor..."
            className="w-full bg-[#111A2B] text-xs text-[#F8FAFC] placeholder-[#64748B] pl-9 pr-3 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500/60"
          />
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                  : 'bg-[#111A2B] hover:bg-[#162033] text-[#94A3B8] hover:text-[#F8FAFC] border-[#22304A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="saas-card p-5 rounded-2xl h-44 animate-pulse bg-[#111A2B]/50" />
          ))}
        </div>
      )}

      {/* Channels Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ch) => (
          <div
            key={ch.id}
            className="saas-card p-5 rounded-2xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#070B14] border border-[#22304A] shrink-0">
                    <img src={ch.thumbnail} alt={ch.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {ch.title}
                    </h3>
                    <span className="text-[11px] text-teal-400 font-medium block">
                      {ch.university}
                    </span>
                  </div>
                </div>

                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" title="Verified Educational Source" />
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                {ch.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#22304A] flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">{ch.subscribers} Subscribers</span>
              <Link
                to={`/?q=${encodeURIComponent(ch.title)}`}
                className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 group-hover:underline"
              >
                <span>Browse Lessons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
