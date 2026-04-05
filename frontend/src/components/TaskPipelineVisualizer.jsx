import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, Layers } from 'lucide-react';

const RefinedTaijiSpiral = ({ size = 60 }) => {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      {/* Subtle outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-charcoal/10 to-transparent blur-lg animate-pulse" />
      
      {/* Abstract Taiji using fine lines and elegant gradients */}
      <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_16s_linear_infinite]">
        <defs>
          <linearGradient id="yin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7F5F0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F7F5F0" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="yang" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2B2B2B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2B2B2B" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer delicate rings */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="#2B2B2B" strokeWidth="0.5" strokeOpacity="0.15" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#2B2B2B" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 6" className="origin-center animate-[spin_24s_linear_infinite_reverse]" />
        
        {/* Core abstract S-curve (Taiji divide) */}
        <path d="M50,8 A42,42 0 0,1 50,92 A21,21 0 0,0 50,50 A21,21 0 0,1 50,8" fill="url(#yin)" filter="url(#glow)" />
        <path d="M50,92 A42,42 0 0,1 50,8 A21,21 0 0,0 50,50 A21,21 0 0,1 50,92" fill="url(#yang)" filter="url(#glow)" />

        {/* Inner dots representing Yin and Yang - CORRECTED */}
        <circle cx="50" cy="29" r="2.5" fill="#2B2B2B" filter="url(#glow)" />
        <circle cx="50" cy="71" r="2.5" fill="#F7F5F0" filter="url(#glow)" />
      </svg>
    </div>
  );
};

const intentMap = {
  learning: { label: '学习指引', color: 'text-[#5c6e46]', bg: 'bg-tea-green/20', border: 'border-tea-green/50' },
  QA: { label: '知识问答', color: 'text-[#3a6e87]', bg: 'bg-cyan-glaze/20', border: 'border-cyan-glaze/50' },
  creation: { label: '创意生成', color: 'text-vermilion', bg: 'bg-vermilion/10', border: 'border-vermilion/30' },
  unknown: { label: '通用对话', color: 'text-charcoal', bg: 'bg-ink-black/5', border: 'border-ink-black/10' },
};

const TaskPipelineVisualizer = ({ intent, tasks, result }) => {
  const intentInfo = intentMap[intent] || intentMap.unknown;

  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-ink-black/10 shadow-sm overflow-hidden my-4 font-sans">
      
      {/* Header: Intent Recognition with Taiji */}
      <div className="relative px-5 py-4 flex items-center justify-between border-b border-ink-black/5 overflow-hidden bg-gradient-to-r from-rice-paper/50 to-transparent">
        <div className="relative z-10 flex items-center gap-4">
          <RefinedTaijiSpiral size={44} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit size={14} className="text-charcoal/50" />
              <span className="text-[11px] text-charcoal/50 font-serif tracking-[0.2em] uppercase">中枢神经 / 意图识别</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-xiaowei text-lg text-ink-black tracking-wide">
                调度管线已建立
              </span>
              {intent && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${intentInfo.border} ${intentInfo.bg} ${intentInfo.color} font-bold tracking-wider shadow-sm`}>
                  {intentInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body: Tasks Pipeline */}
      {tasks && tasks.length > 0 && (
        <div className="p-5 bg-gradient-to-b from-gray-50/80 to-white">
          <div className="flex items-center gap-2 mb-5">
            <Layers size={14} className="text-charcoal/40" />
            <h4 className="font-serif text-xs text-charcoal/60 tracking-widest uppercase">子任务分解详情</h4>
          </div>
          <div className="space-y-4 relative">
            {/* Vertical connector line */}
            <div className="absolute left-3.5 top-3 bottom-5 w-px bg-ink-black/10 z-0" />
            
            {tasks.map((task, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 + 0.1 }}
                key={index} 
                className="relative z-10 flex items-start gap-4 group"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-ink-black/10 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 group-hover:border-vermilion/40 transition-colors">
                  <CheckCircle2 size={14} className="text-[#5c6e46]" />
                </div>
                <div className="flex-1 bg-white p-3.5 rounded-lg border border-ink-black/5 shadow-sm group-hover:shadow transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-xiaowei text-[15px] text-ink-black">
                      {task.method || task.name || task.agent || `子任务 ${index + 1}`}
                    </span>
                    <span className="text-[10px] text-charcoal/40 font-mono bg-ink-black/5 px-1.5 py-0.5 rounded">
                      ID: {task.id}
                    </span>
                  </div>
                  <div className="text-xs text-charcoal/60 font-sans line-clamp-2 bg-rice-paper/50 p-2 rounded">
                    {task.params ? (
                      <span className="font-mono text-[11px] break-all">{JSON.stringify(task.params)}</span>
                    ) : (
                      <span>{task.description || task.task}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskPipelineVisualizer;
