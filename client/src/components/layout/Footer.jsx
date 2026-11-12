import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white tracking-tight text-base">
              LearnTube <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transforming educational YouTube lectures into structured, university-grade learning workspaces with Socratic AI tutoring, smart notes, and exam practice.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Official YouTube Embeds Only • Zero Re-hosting</span>
          </div>
        </div>

        {/* Core Subjects */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Core Curricula
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/learn/operating-systems/vBURTt97EkA" className="hover:text-emerald-400 transition-colors">
                Operating Systems (Gate Smashers / MIT)
              </Link>
            </li>
            <li>
              <Link to="/learn/data-structures-and-algorithms/9TlHvipP5yA" className="hover:text-emerald-400 transition-colors">
                Data Structures & Algorithms (Abdul Bari / MIT)
              </Link>
            </li>
            <li>
              <Link to="/learn/dbms/kBdlM6hNDAE" className="hover:text-emerald-400 transition-colors">
                Database Management Systems (SQL & ACID)
              </Link>
            </li>
            <li>
              <Link to="/learn/computer-networks/IPvYjXCsTg8" className="hover:text-emerald-400 transition-colors">
                Computer Networks (OSI & TCP/IP)
              </Link>
            </li>
            <li>
              <Link to="/learn/machine-learning/fNk_zzaMoSs" className="hover:text-emerald-400 transition-colors">
                Machine Learning & Deep Learning (3Blue1Brown)
              </Link>
            </li>
          </ul>
        </div>

        {/* Learning Tools */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Active Study Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/path-generator" className="hover:text-emerald-400 transition-colors">
                AI Learning Path Generator
              </Link>
            </li>
            <li>
              <Link to="/test" className="hover:text-emerald-400 transition-colors">
                Test Yourself (Exam Simulation Mode)
              </Link>
            </li>
            <li>
              <Link to="/notes" className="hover:text-emerald-400 transition-colors">
                Smart Notes & Markdown Exporter
              </Link>
            </li>
            <li>
              <Link to="/discovery" className="hover:text-emerald-400 transition-colors">
                MIT, Stanford & Harvard Open Courses
              </Link>
            </li>
            <li>
              <Link to="/mastery" className="hover:text-emerald-400 transition-colors">
                Mastery Dashboard & Knowledge Radar
              </Link>
            </li>
          </ul>
        </div>

        {/* Portfolio & Student Profile */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Engineering Portfolio
          </h4>
          <p className="text-xs text-slate-400 mb-2">
            Developed by a <strong>B.Tech Computer Science & Engineering</strong> student as a flagship fullstack project.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span>Stack:</span>
              <span className="font-mono text-emerald-400">React • Node • Gemini</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Architecture:</span>
              <span className="font-mono text-slate-400">Modular REST API</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Integrations:</span>
              <span className="font-mono text-slate-400">YouTube Data & IFrame</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 LearnTube AI. Built with precision for students worldwide.</p>
        <p className="flex items-center gap-1">
          Crafted for university mastery <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </p>
      </div>
    </footer>
  );
};
