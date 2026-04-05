/**
 * OrchestratorHeroA — 太极螺旋入场
 * Hero center: animated Taiji spiral SVG with CSS rotation + orbiting particles
 * Frosted glass input floating above the spiral
 * Result: scroll unfurl animation with 印章 seal stamp
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Eye, BookOpen, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HINTS = [
  { label: '学习皮影手势', icon: Eye },
  { label: '查询非遗知识', icon: BookOpen },
  { label: '生成创作图案', icon: Palette },
];

const AGENTS = [
  { id: 'vision', label: '视觉导师', color: 'cyan-glaze', route: '/vision-mentor' },
  { id: 'knowledge', label: '知识馆长', color: 'tea-green', route: '/knowledge-curator' },
  { id: 'creative', label: '创意艺匠', color: 'vermilion', route: '/creative-workshop' },
];

// Taiji SVG spiral component
const TaijiSpiral = ({ speed = 1 }) => (
  <div className="relative w-[320px] h-[320px] flex items-center justify-center">
    {/* Outer glow ring */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-white/5 blur-2xl animate-pulse opacity-60" />

    {/* Elegant SVG Taiji */}
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" style={{ animation: `spin ${24 / speed}s linear infinite` }}>
      <defs>
        <linearGradient id="yinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7F5F0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F7F5F0" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="yangGrad" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2B2B2B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2B2B2B" stopOpacity="0.1" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer delicate rings */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#F7F5F0" strokeWidth="0.2" strokeOpacity="0.15" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#F7F5F0" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 4" className="origin-center" style={{ animation: `spin ${30 / speed}s linear infinite reverse` }} />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#F7F5F0" strokeWidth="0.3" strokeOpacity="0.1" strokeDasharray="4 8" className="origin-center" style={{ animation: `spin ${20 / speed}s linear infinite` }} />

      {/* Core abstract S-curve (Taiji divide) */}
      <path d="M50,8 A42,42 0 0,1 50,92 A21,21 0 0,0 50,50 A21,21 0 0,1 50,8" fill="url(#yinGrad)" filter="url(#softGlow)" />
      <path d="M50,92 A42,42 0 0,1 50,8 A21,21 0 0,0 50,50 A21,21 0 0,1 50,92" fill="url(#yangGrad)" filter="url(#softGlow)" />

      {/* Inner dots representing Yin and Yang - CORRECTED (Yin within Yang, Yang within Yin) */}
      <circle cx="50" cy="29" r="2.5" fill="#2B2B2B" filter="url(#softGlow)" />
      <circle cx="50" cy="71" r="2.5" fill="#F7F5F0" filter="url(#softGlow)" />
    </svg>

    {/* Orbiting geometric particles */}
    {[...Array(3)].map((_, i) => (
      <div
        key={`orbit1-${i}`}
        className="absolute w-1.5 h-1.5 rounded-full bg-white/80 blur-[1px]"
        style={{
          top: '50%',
          left: '50%',
          animation: `orbit ${12 / speed + i * 2}s linear infinite`,
          animationDelay: `${i * -2}s`,
          ['--angle']: `${i * 120}deg`,
          ['--radius']: '170px'
        }}
      />
    ))}
    {[...Array(3)].map((_, i) => (
      <div
        key={`orbit2-${i}`}
        className="absolute w-1 h-1 rounded-full bg-white/40 blur-[1px]"
        style={{
          top: '50%',
          left: '50%',
          animation: `orbit ${15 / speed + i * 2}s linear infinite reverse`,
          animationDelay: `${i * -3}s`,
          ['--angle']: `${i * 120 + 60}deg`,
          ['--radius']: '150px'
        }}
      />
    ))}

    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes orbit {
        from { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle))); }
        to { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * var(--angle) - 360deg)); }
      }
    `}</style>
  </div>
);

// Scroll unfurl result card
const ScrollResult = ({ result, onClose, navigate }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="origin-top w-full max-w-2xl mx-auto"
    >
      <div className="bg-rice-paper rounded-xl overflow-hidden shadow-2xl border border-ink-black/10 relative">
        {/* Scroll top rod */}
        <div className="h-3 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 flex items-center justify-center">
          <div className="w-24 h-1 bg-amber-800/40 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vermilion/10 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-vermilion" />
              </div>
              <div>
                <div className="font-xiaowei text-lg text-ink-black">主协调员</div>
                <div className="text-xs text-charcoal/50 font-serif">智能调度完成</div>
              </div>
            </div>
            {/* Seal stamp */}
            <div className="w-14 h-14 border-2 border-vermilion/60 rounded-full flex items-center justify-center bg-vermilion/5 rotate-12">
              <span className="font-calligraphy text-vermilion text-xl">承</span>
            </div>
          </div>

          {/* Result text */}
          <div className="font-serif text-ink-black leading-relaxed text-base whitespace-pre-wrap mb-6">
            {result}
          </div>

          {/* Agent dispatch */}
          <div className="border-t border-ink-black/10 pt-4">
            <div className="text-xs text-charcoal/40 font-serif mb-3">已为您调度</div>
            <div className="flex gap-3 flex-wrap">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => { navigate(agent.route); onClose(); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-${agent.color}/30 bg-${agent.color}/5 hover:bg-${agent.color}/10 transition-colors text-sm font-xiaowei`}
                >
                  {agent.label} →
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll bottom rod */}
        <div className="h-3 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 flex items-center justify-center">
          <div className="w-24 h-1 bg-amber-800/40 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

const OrchestratorHeroA = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleHint = (label) => {
    setQuery(label);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);

    // Simulate API call
    await new Promise(r => setTimeout(r, 1800));

    const responses = [
      '已为您调度视觉导师，开始追踪您的手势。皮影戏的核心在于手指角度与力道的配合，请跟随指引完成练习。',
      '根据您的问题，已从知识图谱中检索到相关内容：皮影戏起源于西汉，是中国最古老的传统艺术形式之一...',
      '创意艺匠已准备就绪。您的创作意图已被解析，正在为您生成专属非遗风格图案...',
    ];
    setResult(responses[Math.floor(Math.random() * responses.length)]);
    setIsLoading(false);
  };

  const handleClose = () => {
    setResult(null);
    setQuery('');
  };

  return (
    <div className="relative min-h-[600px] flex flex-col items-center justify-center py-24 overflow-hidden">

      {/* Background: deep ink gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-black via-[#1a1410] to-ink-black" />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 30% 50%, #C04851 0%, transparent 50%),
                          radial-gradient(circle at 70% 50%, #D4A574 0%, transparent 50%)`
      }} />

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 text-center mb-12"
      >
        <h2 className="font-calligraphy text-5xl md:text-6xl text-rice-paper mb-3">
          指尖<span className="text-vermilion">乾坤</span>
        </h2>
        <p className="font-serif text-rice-paper/50 text-lg">告诉我想学什么，AI 导师为您指路</p>
      </motion.div>

      {/* Taiji Spiral */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 mb-8"
      >
        <TaijiSpiral speed={query.length > 0 ? 2 : 0.8} />
      </motion.div>

      {/* Frosted Glass Input */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative z-10 w-full max-w-xl px-4"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative backdrop-blur-xl bg-rice-paper/10 border border-rice-paper/20 rounded-2xl overflow-hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="描述您想学什么，或想创作什么..."
                  disabled={isLoading}
                  className="w-full bg-transparent px-8 py-5 pr-14 text-rice-paper placeholder:text-rice-paper/30 font-serif text-base outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-vermilion hover:bg-vermilion/90 disabled:bg-rice-paper/10 text-white rounded-full flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              </div>

              {/* Loading shimmer */}
              {isLoading && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-vermilion/30 overflow-hidden rounded-b-2xl">
                  <div className="h-full bg-vermilion animate-[shimmer_1.8s_ease-in-out_infinite]" style={{
                    width: '40%',
                    animation: 'shimmer 1.8s ease-in-out infinite',
                  }} />
                </div>
              )}
            </form>

            {/* Hint chips */}
            <div className="flex justify-center gap-3 mt-5 flex-wrap">
              {HINTS.map(hint => {
                const Icon = hint.icon;
                return (
                  <button
                    key={hint.label}
                    onClick={() => handleHint(hint.label)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-rice-paper/20 bg-rice-paper/5 hover:bg-rice-paper/10 text-rice-paper/70 hover:text-rice-paper text-sm font-serif transition-all hover:border-vermilion/40"
                  >
                    <Icon size={14} />
                    {hint.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full max-w-2xl px-4"
          >
            <ScrollResult result={result} onClose={handleClose} navigate={navigate} />
            <button
              onClick={handleClose}
              className="mt-6 mx-auto block text-rice-paper/40 hover:text-rice-paper/70 text-sm font-serif transition-colors"
            >
              ← 继续探索
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default OrchestratorHeroA;
