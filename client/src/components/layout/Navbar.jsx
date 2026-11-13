import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Compass,
  MapPin,
  FileText,
  CheckCircle2,
  Trophy,
  Settings,
  Search,
  Flame,
  Zap,
  Menu,
  X,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = () => {
  const { mastery, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Courses', path: '/', icon: BookOpen },
    { label: 'Discover', path: '/discovery', icon: Compass },
    { label: 'Learning Paths', path: '/path-generator', icon: MapPin },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Practice', path: '/test', icon: CheckCircle2 },
    { label: 'Progress', path: '/mastery', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070B14]/90 backdrop-blur-md border-b border-[#22304A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo Area */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-[#111A2B] border border-[#22304A] group-hover:border-teal-500/40 flex items-center justify-center transition-colors">
            <GraduationCap className="w-5 h-5 text-teal-400 transition-transform duration-200 group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[17px] tracking-tight text-[#F8FAFC]">
                Learn<span className="text-teal-400">Tube</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 leading-none">
                AI
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] font-medium tracking-normal -mt-0.5">
              Personal University
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111A2B] border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.8]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Area: Status indicators + User Profile Dropdown + Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Indicator */}
          <div
            title="Active Study Streak"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111A2B] border border-[#22304A] text-amber-400 text-xs font-medium"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
            <span className="tabular-nums font-semibold">{mastery?.streakDays || 1}d</span>
          </div>

          {/* XP Indicator */}
          <div
            title="Total Knowledge XP"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111A2B] border border-[#22304A] text-teal-400 text-xs font-medium"
          >
            <Zap className="w-3.5 h-3.5 fill-teal-400/20 text-teal-400" />
            <span className="tabular-nums font-semibold">{mastery?.totalXp || 150} XP</span>
          </div>

          {/* User Settings Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#111A2B] border border-[#22304A] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#324466] transition-colors text-xs font-medium"
              aria-label="User settings and preferences"
              aria-expanded={profileDropdownOpen}
            >
              <Settings className="w-4 h-4 text-[#94A3B8]" />
              <span className="hidden md:inline">Account</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 hidden md:inline ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111A2B] border border-[#22304A] shadow-xl py-1 z-50 text-xs">
                <div className="px-3.5 py-2.5 border-b border-[#22304A]">
                  <p className="font-semibold text-[#F8FAFC]">University Workspace</p>
                  <p className="text-[#64748B] text-[11px] truncate">
                    Lang: {settings?.preferredLanguage || 'English'}
                  </p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162033] transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Platform Settings</span>
                </Link>
                <Link
                  to="/mastery"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162033] transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5 text-teal-400" />
                  <span>Mastery & Analytics</span>
                </Link>
                <div className="border-t border-[#22304A] my-1"></div>
                <div className="px-3.5 py-1.5 text-[11px] text-[#64748B]">
                  LearnTube SaaS v1.0
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#111A2B] border border-[#22304A] text-[#94A3B8] hover:text-[#F8FAFC]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1220] border-b border-[#22304A] px-4 py-4 space-y-3">
          {/* Quick Search inside Mobile Menu */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects or university lectures..."
              className="w-full bg-[#111A2B] text-xs text-[#F8FAFC] placeholder-[#64748B] pl-9 pr-3 py-2.5 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500/60"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111A2B] border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              to="/settings"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111A2B] border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
