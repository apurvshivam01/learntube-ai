import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#22304A] bg-[#070B14] py-12 px-4 sm:px-6 lg:px-8 text-[#94A3B8] text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#111A2B] border border-[#22304A] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-teal-400" />
            </div>
            <span className="font-semibold text-white tracking-tight text-base">
              Learn<span className="text-teal-400">Tube</span> <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">AI</span>
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Transforming educational YouTube lectures into structured, university-grade learning paths with Socratic AI tutoring, smart notes, and exam practice.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Official YouTube Embeds • Zero Re-hosting</span>
          </div>
        </div>

        {/* Core Subjects */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Core Curricula
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/learn/operating-systems/vBURTt97EkA" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Operating Systems (Gate Smashers / MIT)
              </Link>
            </li>
            <li>
              <Link to="/learn/data-structures-and-algorithms/9TlHvipP5yA" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Data Structures & Algorithms (Abdul Bari / MIT)
              </Link>
            </li>
            <li>
              <Link to="/learn/dbms/kBdlM6hNDAE" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Database Management Systems (SQL & ACID)
              </Link>
            </li>
            <li>
              <Link to="/learn/computer-networks/IPvYjXCsTg8" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Computer Networks (OSI & TCP/IP)
              </Link>
            </li>
            <li>
              <Link to="/learn/machine-learning/fNk_zzaMoSs" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Machine Learning & Deep Learning (3Blue1Brown)
              </Link>
            </li>
          </ul>
        </div>

        {/* Learning Tools */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Active Study Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/path-generator" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                AI Learning Path Generator
              </Link>
            </li>
            <li>
              <Link to="/test" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Test Yourself (Exam Simulation Mode)
              </Link>
            </li>
            <li>
              <Link to="/notes" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Smart Notes & Markdown Exporter
              </Link>
            </li>
            <li>
              <Link to="/discovery" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                MIT, Stanford & Harvard Open Courses
              </Link>
            </li>
            <li>
              <Link to="/mastery" className="text-[#94A3B8] hover:text-teal-400 transition-colors">
                Mastery Dashboard & Knowledge Radar
              </Link>
            </li>
          </ul>
        </div>

        {/* Portfolio & Student Profile */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Engineering Platform
          </h4>
          <p className="text-xs text-[#94A3B8] mb-2">
            Distraction-free educational SaaS platform designed for university students and engineers.
          </p>
          <div className="p-3 rounded-xl bg-[#111A2B] border border-[#22304A] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>Stack:</span>
              <span className="font-mono text-teal-400">React 19 • Tailwind • Vite</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>Intelligence:</span>
              <span className="font-mono text-slate-300">Socratic AI Engine</span>
            </div>
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>Content:</span>
              <span className="font-mono text-slate-300">Verified University Syllabi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#22304A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
        <p>© 2026 LearnTube AI. Designed for focused, high-yield university learning.</p>
        <p className="flex items-center gap-1.5">
          <span>Personal University Architecture</span>
          <span className="w-1 h-1 rounded-full bg-teal-400"></span>
          <span className="text-teal-400 font-medium">Production Ready</span>
        </p>
      </div>
    </footer>
  );
};
