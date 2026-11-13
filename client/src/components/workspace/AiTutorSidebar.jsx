import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AiTutorSidebar = ({
  topic,
  videoTitle,
  transcript,
}) => {
  const { settings } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `👋 **Hello! I'm your LearnTube AI Tutor.**\n\nI'm connected to **${topic || 'this lecture'}**. Ask me to explain difficult concepts, give real-world analogies, highlight exam points, or test your understanding!`,
      source: 'LearnTube Tutor',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(settings?.preferredLanguage || 'English');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    'Explain this simply',
    'Give me an analogy',
    'Explain in Hindi',
    'High-yield exam points',
    'What is the difference between a process and thread?',
    'Ask me questions from this topic',
  ];

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await api.tutorChat({
        message: text,
        history: historyPayload,
        topic,
        videoTitle,
        transcript,
        language: selectedLanguage,
        persona: settings?.tutorPersona || 'balanced',
      });

      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'ai_' + Date.now(),
            role: 'assistant',
            text: res.response,
            source: res.source,
            groundedInTranscript: res.groundedInTranscript,
          },
        ]);
      } else {
        throw new Error(res.message || 'Failed to get AI response');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          text: `⚠️ **AI Notice:** Could not fetch response (${err.message}). Using local pedagogical insights.`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        text: `🧹 Chat cleared. What would you like to explore in **${topic || 'this topic'}**?`,
      },
    ]);
  };

  return (
    <aside className="w-full lg:w-96 shrink-0 bg-[#111A2B] border border-[#22304A] rounded-2xl flex flex-col h-[750px] overflow-hidden">
      {/* Tutor Header */}
      <div className="p-3.5 border-b border-[#22304A] flex items-center justify-between bg-[#0B1220]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>AI Learning Tutor</span>
              <Sparkles className="w-3 h-3 text-teal-400" />
            </h3>
            <p className="text-[10px] text-[#94A3B8] line-clamp-1">
              Context: {topic || 'Active Lecture'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-[10px] bg-[#162033] text-[#F8FAFC] border border-[#22304A] rounded-md px-1.5 py-1 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
            <option value="Tamil">தமிழ்</option>
            <option value="Telugu">తెలుగు</option>
            <option value="Bengali">বাংলা</option>
          </select>

          <button
            onClick={handleClearChat}
            className="p-1 rounded-md text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#162033] transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pr-2">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-teal-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-teal-500 text-[#070B14] font-medium rounded-br-none'
                    : 'bg-[#162033] border border-[#22304A] text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {!isUser && m.source && (
                  <div className="mt-1.5 pt-1.5 border-t border-[#22304A] flex items-center justify-between text-[9px] text-[#94A3B8]">
                    <span>{m.source}</span>
                    {m.groundedInTranscript && (
                      <span className="text-teal-400 font-semibold">Grounded in Lesson</span>
                    )}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-md bg-[#162033] border border-[#22304A] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-[#94A3B8]">
            <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            </div>
            <span className="italic">AI Tutor is analyzing lecture material...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-2 border-t border-[#22304A] bg-[#0B1220]">
        <p className="text-[10px] text-[#64748B] mb-1.5 font-semibold">Quick Prompts:</p>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#111A2B] hover:bg-[#162033] text-[#94A3B8] hover:text-white border border-[#22304A] hover:border-[#324466] transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-[#22304A] flex items-center gap-2 bg-[#0B1220]"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask AI tutor in ${selectedLanguage}...`}
          disabled={isLoading}
          className="flex-1 bg-[#111A2B] text-xs text-[#F8FAFC] placeholder-[#64748B] px-3 py-2 rounded-lg border border-[#22304A] focus:outline-none focus:border-teal-500/60 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-[#070B14] font-semibold transition-colors"
        >
          <Send className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </form>
    </aside>
  );
};
