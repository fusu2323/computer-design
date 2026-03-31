import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../animations/variants';
import { Sparkles, Eye, BookOpen, Palette, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8002';

// Agent tile configuration
const AGENTS = [
  {
    id: 'vision',
    name: '视觉导师',
    icon: Eye,
    color: 'cyan-glaze',
    border: 'border-cyan-glaze',
    bg: 'bg-cyan-glaze',
    description: '手眼身法，姿态纠正',
    route: '/vision-mentor'
  },
  {
    id: 'knowledge',
    name: '知识馆长',
    icon: BookOpen,
    color: 'tea-green',
    border: 'border-tea-green',
    bg: 'bg-tea-green',
    description: '博古通今，知识图谱',
    route: '/knowledge-curator'
  },
  {
    id: 'creative',
    name: '创意艺匠',
    icon: Palette,
    color: 'vermilion',
    border: 'border-vermilion',
    bg: 'bg-vermilion',
    description: '妙笔生花，风格复原',
    route: '/creative-workshop'
  }
];

const OmniOrchestrator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResult(null);
      setError(null);
      setQuery('');
      setSelectedAgent(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const sessionId = localStorage.getItem('orchestrator_session_id') || `session-${Date.now()}`;
      localStorage.setItem('orchestrator_session_id', sessionId);

      const response = await fetch(`${API_BASE}/api/v1/orchestrator/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          session_id: sessionId,
          history: []
        })
      });

      if (!response.ok) throw new Error('Orchestrator request failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Orchestrator error:', err);
      setError('抱歉，服务暂时不可用，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    inputRef.current?.focus();
  };

  const handleNavigate = (route) => {
    navigate(route);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
    setError(null);
    setQuery('');
    setSelectedAgent(null);
  };

  return (
    <>
      {/* Navbar 印章 Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-[70] w-12 h-12 rounded-full bg-vermilion text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform duration-300"
        title="打开传承指令面板 (⌘K)"
      >
        <div className="font-calligraphy text-xl">承</div>
      </button>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-black/70 backdrop-blur-sm z-[80]"
              onClick={handleClose}
            />

            {/* Palette Panel */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] px-4 pointer-events-none"
            >
              <div
                className="w-full max-w-2xl bg-rice-paper rounded-xl shadow-2xl border border-ink-black/10 overflow-hidden pointer-events-auto"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-ink-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-vermilion to-amber-600 rounded-full flex items-center justify-center text-white font-calligraphy text-lg shadow-lg">
                      承
                    </div>
                    <div>
                      <h2 className="font-xiaowei text-xl text-ink-black">传承指令面板</h2>
                      <p className="text-xs text-charcoal/50 font-serif">输入您的需求，智能调度 Agent</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-ink-black/5 hover:bg-ink-black/10 flex items-center justify-center text-charcoal/60 hover:text-ink-black transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Agent Tiles */}
                <div className="px-8 py-5 border-b border-ink-black/5 bg-ink-black/[0.02]">
                  <p className="text-xs text-charcoal/40 font-serif mb-3">选择导师，或直接输入问题</p>
                  <div className="flex gap-3">
                    {AGENTS.map(agent => {
                      const Icon = agent.icon;
                      const isSelected = selectedAgent?.id === agent.id;
                      return (
                        <button
                          key={agent.id}
                          onClick={() => handleAgentSelect(agent)}
                          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? `${agent.border} ${agent.bg}/10 shadow-md`
                              : 'border-ink-black/5 bg-white hover:border-ink-black/20'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isSelected ? agent.bg : 'bg-ink-black/5'
                          }`}>
                            <Icon size={22} className={isSelected ? 'text-white' : 'text-charcoal/60'} />
                          </div>
                          <div className="text-center">
                            <div className={`font-xiaowei text-sm ${isSelected ? `text-${agent.color}` : 'text-ink-black'}`}>
                              {agent.name}
                            </div>
                            <div className="text-xs text-charcoal/40 font-serif mt-0.5">{agent.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="px-8 py-6">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={selectedAgent ? `问${selectedAgent.name}一个问题...` : '描述您想学什么，或想创作什么...'}
                      disabled={isLoading}
                      className="w-full px-6 py-4 bg-white border-2 border-ink-black/10 rounded-xl text-ink-black font-serif text-base focus:outline-none focus:border-vermilion transition-colors placeholder:text-charcoal/30 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!query.trim() || isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-vermilion hover:bg-vermilion/90 disabled:bg-ink-black/10 disabled:text-charcoal/30 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-serif">
                      {error}
                    </div>
                  )}

                  {/* Result Card */}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-6 bg-white border-l-4 border-vermilion rounded-xl shadow-lg"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-vermilion/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles size={16} className="text-vermilion" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-xiaowei text-sm text-vermilion mb-1">主协调员</div>
                          <div className="font-serif text-ink-black leading-relaxed whitespace-pre-wrap">
                            {result.final_answer || '处理完成'}
                          </div>
                        </div>
                      </div>

                      {/* Agent dispatch cards */}
                      {result.tasks && result.tasks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-ink-black/5">
                          <div className="text-xs text-charcoal/40 font-serif mb-3">已调度：</div>
                          <div className="flex flex-wrap gap-2">
                            {result.tasks.map((task, idx) => {
                              const agent = AGENTS.find(a => a.id === task.agent);
                              if (!agent) return null;
                              const Icon = agent.icon;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleNavigate(agent.route)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${agent.border} bg-white hover:${agent.bg}/5 transition-colors text-sm`}
                                >
                                  <Icon size={14} />
                                  <span className="font-xiaowei">{agent.name}</span>
                                  <span className="text-charcoal/60 font-serif text-xs">→</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </form>

                {/* Footer hint */}
                <div className="px-8 pb-5 text-center">
                  <span className="text-xs text-charcoal/30 font-serif">按 </span>
                  <kbd className="text-xs bg-ink-black/5 px-1.5 py-0.5 rounded font-mono">Esc</kbd>
                  <span className="text-xs text-charcoal/30 font-serif"> 关闭 · </span>
                  <kbd className="text-xs bg-ink-black/5 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                  <span className="text-xs text-charcoal/30 font-serif"> 打开</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default OmniOrchestrator;