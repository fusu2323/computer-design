/**
 * OrchestratorHeroC — 画卷展开
 * Homepage loads with scroll painting unfurl animation
 * Misty mountain ink-wash background, frosted glass input
 * Result: museum card / 非遗藏品展牌 style
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

// Misty mountain SVG background
const MistyMountains = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg viewBox="0 0 1440 600" className="w-full h-full opacity-[0.07]" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C04851" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
      {/* Mountain silhouettes */}
      <path d="M0,600 L0,350 Q180,280 360,320 Q540,360 720,280 Q900,200 1080,260 Q1260,320 1440,240 L1440,600 Z" fill="url(#mtnGrad)" />
      <path d="M0,600 L0,420 Q200,380 400,400 Q600,420 800,360 Q1000,300 1200,350 Q1300,380 1440,340 L1440,600 Z" fill="url(#mtnGrad)" opacity="0.5" />
      <path d="M0,600 L0,480 Q300,440 600,470 Q900,500 1200,450 Q1350,430 1440,460 L1440,600 Z" fill="url(#mtnGrad)" opacity="0.3" />
    </svg>
    {/* Mist layers */}
    <div className="absolute inset-0 bg-gradient-to-t from-rice-paper via-transparent to-transparent opacity-[0.03]" />
  </div>
);

// Museum collection card result
const MuseumCard = ({ result, onClose, navigate }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Outer decorative frame */}
      <div className="relative border-4 border-double border-ink-black/20 rounded-lg overflow-hidden bg-rice-paper shadow-2xl">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-vermilion rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-vermilion rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-vermilion rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-vermilion rounded-br-lg" />

        {/* Inner content */}
        <div className="p-10 pt-8">
          {/* Collection header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-2 border-vermilion/40 rotate-45 rounded-lg" />
                <div className="absolute inset-2 bg-vermilion/10 rotate-45 rounded-md flex items-center justify-center">
                  <span className="font-calligraphy text-vermilion text-2xl -rotate-45">藏</span>
                </div>
              </div>
              <div>
                <div className="font-xiaowei text-2xl text-ink-black">数字传承人藏品</div>
                <div className="font-serif text-charcoal/50 text-sm">Digital Inheritor Collection · 2026</div>
              </div>
            </div>

            {/* Seal */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 border-2 border-vermilion/70 rounded-lg flex items-center justify-center bg-vermilion/5">
                <span className="font-calligraphy text-vermilion text-2xl">承</span>
              </div>
              <div className="text-[10px] text-charcoal/40 font-serif">非遗认证</div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-ink-black/20 to-transparent mb-8">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-rice-paper border border-ink-black/20 rotate-45" />
          </div>

          {/* Result content */}
          <div className="font-serif text-ink-black leading-loose text-base whitespace-pre-wrap mb-8">
            {result}
          </div>

          {/* Metadata row */}
          <div className="flex items-center justify-between text-xs text-charcoal/40 font-serif border-t border-ink-black/10 pt-4">
            <span>编号：DI-{Date.now().toString().slice(-6)}</span>
            <span>主协调员出品</span>
            <span>AI 辅助创作</span>
          </div>
        </div>
      </div>

      {/* Agent navigation buttons */}
      <div className="mt-6 flex justify-center gap-4">
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => { navigate(agent.route); onClose(); }}
            className={`px-6 py-3 rounded-lg border-2 border-${agent.color}/40 bg-${agent.color}/5 hover:bg-${agent.color}/10 text-ink-black font-xiaowei text-sm transition-all flex items-center gap-2`}
          >
            {agent.label} <span className="text-charcoal/40">→</span>
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-4 mx-auto block text-charcoal/40 hover:text-charcoal/70 text-sm font-serif transition-colors"
      >
        ← 继续探索
      </button>
    </motion.div>
  );
};

const OrchestratorHeroC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isUnfurled, setIsUnfurled] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Trigger unfurl on mount
  useEffect(() => {
    const t = setTimeout(() => setIsUnfurled(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isUnfurled) inputRef.current?.focus();
  }, [isUnfurled]);

  const handleHint = (label) => {
    setQuery(label);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);

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
    <div className="relative min-h-[600px] py-24 overflow-hidden">

      {/* Rice paper background */}
      <div className="absolute inset-0 bg-rice-paper" />
      <MistyMountains />

      {/* Scroll unfurl animation — left and right panels */}
      <AnimatePresence>
        {!isUnfurled ? (
          <>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-ink-black/90 to-ink-black/60 z-30"
            />
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 bg-gradient-to-l from-ink-black/90 to-ink-black/60 z-30"
            />
          </>
        ) : null}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence>
        {isUnfurled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 max-w-3xl mx-auto px-4"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block mb-4"
              >
                <span className="seal-border text-vermilion font-calligraphy text-lg">AI 智能入口</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-calligraphy text-5xl md:text-6xl text-ink-black mb-3"
              >
                告诉我想<span className="text-vermilion">学什么</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-serif text-charcoal/60 text-lg"
              >
                千年技艺，一语即达
              </motion.p>
            </div>

            {/* Frosted glass input */}
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="input-c"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.7 }}
                >
                  <form onSubmit={handleSubmit}>
                    <div className="relative backdrop-blur-md bg-white/60 border border-ink-black/10 rounded-2xl shadow-xl overflow-hidden">
                      {/* Top accent line */}
                      <div className="h-1 bg-gradient-to-r from-vermilion via-amber-500 to-vermilion" />
                      <div className="flex items-center px-6 py-5 gap-4">
                        <div className="w-10 h-10 bg-vermilion/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles size={20} className="text-vermilion" />
                        </div>
                        <input
                          ref={inputRef}
                          type="text"
                          value={query}
                          onChange={e => setQuery(e.target.value)}
                          placeholder="描述您想学什么，或想创作什么..."
                          disabled={isLoading}
                          className="flex-grow bg-transparent text-ink-black placeholder:text-charcoal/30 font-serif text-base outline-none disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={!query.trim() || isLoading}
                          className="w-11 h-11 bg-vermilion hover:bg-vermilion/90 disabled:bg-ink-black/10 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <ArrowRight size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Hint chips */}
                  <div className="flex justify-center gap-3 mt-5 flex-wrap">
                    {HINTS.map(hint => {
                      const Icon = hint.icon;
                      return (
                        <button
                          key={hint.label}
                          onClick={() => handleHint(hint.label)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-vermilion/30 bg-vermilion/5 hover:bg-vermilion/10 text-vermilion/80 hover:text-vermilion text-sm font-serif transition-all"
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
                  key="result-c"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <MuseumCard result={result} onClose={handleClose} navigate={navigate} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrchestratorHeroC;
