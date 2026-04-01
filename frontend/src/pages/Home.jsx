/**
 * Home.jsx — TEMPORARY DUAL DESIGN TOGGLE FOR ORCHESTRATOR COMPARISON
 *
 * HOW TO USE:
 * - Toggle between Design A (太极螺旋) and Design C (画卷展开) using the DevOverlay below
 * - After choosing, REPLACE the chosen design into the Hero section and remove the toggle
 *
 * TO CHOOSE A DESIGN:
 * 1. Design A: import OrchestratorHeroA — dark theme, Taiji spiral, scroll unfurl result
 * 2. Design C: import OrchestratorHeroC — light theme, scroll unfurl on load, museum card result
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import HomeImage from '../assets/Home.png';
import OrchestratorHeroA from '../components/OrchestratorHeroA';
import OrchestratorHeroC from '../components/OrchestratorHeroC';

// ===== TEMPORARY DEV TOGGLE — REMOVE AFTER CHOOSING =====
const DevOverlay = ({ active, onToggle }) => (
  <div className="fixed bottom-4 left-4 z-[100] flex items-center gap-3 bg-ink-black/90 backdrop-blur px-4 py-3 rounded-xl border border-white/10 shadow-2xl">
    <span className="text-rice-paper/60 text-xs font-serif">设计对比</span>
    <div className="flex gap-1">
      {['A', 'C'].map(d => (
        <button
          key={d}
          onClick={() => onToggle(d)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            active === d
              ? 'bg-vermilion text-white'
              : 'bg-white/10 text-rice-paper/60 hover:bg-white/20'
          }`}
        >
          设计{d}
        </button>
      ))}
    </div>
    <span className="text-rice-paper/30 text-xs">太极螺旋 vs 画卷展开</span>
  </div>
);
// ===== END TEMPORARY TOGGLE =====

const Home = () => {
  const navigate = useNavigate();
  const [orchestratorDesign, setOrchestratorDesign] = useState('A');

  return (
    <div className="min-h-screen bg-rice-paper">
      <Navbar />

      {/* ===== ORCHESTRATOR HERO — REPLACE THIS SECTION WITH CHOSEN DESIGN ===== */}
      {orchestratorDesign === 'A' ? <OrchestratorHeroA /> : <OrchestratorHeroC />}
      {/* ===== END ORCHESTRATOR HERO ===== */}

      {/* Temp toggle - REMOVE AFTER CHOOSING */}
      <DevOverlay active={orchestratorDesign} onToggle={setOrchestratorDesign} />

      <main className="pt-8 pb-20 px-4 md:px-12 max-w-7xl mx-auto">

        {/* Agents Section */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-12 border-b border-ink-black/10 pb-4">
            <div>
              <h2 className="font-xiaowei text-3xl mb-2">三位导师</h2>
              <p className="font-sans text-charcoal/60 text-sm">Multi-Agent Collaborative System</p>
            </div>
            <div className="hidden md:block text-ink-black/40 font-calligraphy text-2xl">
              师者 · 匠心 · 智识
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Agent 1: Vision */}
            <div className="group card-shadow bg-white p-8 rounded-sm relative overflow-hidden cursor-pointer ink-spread border-t-4 border-cyan-glaze hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-calligraphy text-9xl">眼</span>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-cyan-glaze/10 rounded-full flex items-center justify-center mb-6 text-cyan-glaze">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 className="font-xiaowei text-2xl mb-3 group-hover:text-cyan-glaze transition-colors">视觉导师 Agent</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-6 font-sans">
                  Vision-Mentor
                  <br /><br />
                  实时捕捉手势动作，利用 MediaPipe 与 ST-GCN 技术进行骨骼关键点分析。如同师父在侧，纠正每一针的角度与力度。
                </p>
                <a href="/vision-mentor" className="inline-flex items-center text-cyan-glaze font-bold text-sm tracking-widest hover:underline">
                  进入修习 <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Agent 2: Knowledge */}
            <div className="group card-shadow bg-white p-8 rounded-sm relative overflow-hidden cursor-pointer ink-spread border-t-4 border-tea-green hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-calligraphy text-9xl">知</span>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-tea-green/30 rounded-full flex items-center justify-center mb-6 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <h3 className="font-xiaowei text-2xl mb-3 group-hover:text-green-700 transition-colors">知识馆长 Agent</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-6 font-sans">
                  Knowledge-Curator
                  <br /><br />
                  挂载非遗知识图谱，为您讲述技艺背后的历史与美学。通过 RAG 技术，精准回答每一个关于材料、流派与文化的疑问。
                </p>
                <a href="/knowledge-curator" className="inline-flex items-center text-green-700 font-bold text-sm tracking-widest hover:underline">
                  查阅典籍 <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Agent 3: Creative */}
            <div className="group card-shadow bg-white p-8 rounded-sm relative overflow-hidden cursor-pointer ink-spread border-t-4 border-vermilion hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="font-calligraphy text-9xl">艺</span>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-vermilion/10 rounded-full flex items-center justify-center mb-6 text-vermilion">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                </div>
                <h3 className="font-xiaowei text-2xl mb-3 group-hover:text-vermilion transition-colors">创意艺匠 Agent</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-6 font-sans">
                  Creative-Artisan
                  <br /><br />
                  将您的草图瞬间转化为非遗风格的大师之作。加载特定 LoRA 模型，探索苏绣质感或青花纹样的无限可能。
                </p>
                <a href="/creative-workshop" className="inline-flex items-center text-vermilion font-bold text-sm tracking-widest hover:underline">
                  开始创作 <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow Puppet Feature Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-ink-black/90 to-ink-black/70 rounded-sm p-8 md:p-12 relative overflow-hidden text-rice-paper">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-0 top-0 w-64 h-64 border border-rice-paper/20 rounded-full"></div>
              <div className="absolute right-32 top-32 w-48 h-48 border border-rice-paper/20 rounded-full"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block mb-4">
                  <span className="seal-border text-vermilion font-calligraphy text-sm">新增技艺</span>
                </div>
                <h2 className="font-calligraphy text-4xl md:text-5xl mb-6">皮影戏</h2>
                <p className="font-serif text-lg text-rice-paper/80 mb-6 leading-relaxed">
                  一口叙说千古事，双手对舞百万兵。<br />
                  皮影戏起源于西汉，是光影艺术与戏曲表演的完美结合。<br />
                  2011 年入选联合国教科文组织人类非物质文化遗产代表作名录。
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-rice-paper/10 px-4 py-2 rounded-sm">
                    <span className="text-vermilion font-bold">10+</span>
                    <span className="text-rice-paper/70 text-sm ml-2">主要流派</span>
                  </div>
                  <div className="bg-rice-paper/10 px-4 py-2 rounded-sm">
                    <span className="text-vermilion font-bold">9</span>
                    <span className="text-rice-paper/70 text-sm ml-2">制作工艺</span>
                  </div>
                  <div className="bg-rice-paper/10 px-4 py-2 rounded-sm">
                    <span className="text-vermilion font-bold">8</span>
                    <span className="text-rice-paper/70 text-sm ml-2">经典剧目</span>
                  </div>
                </div>
                <Button onClick={() => navigate('/shadow-puppet')}>学习皮影戏</Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { char: '影', title: '光影艺术', desc: '灯光照射下，影人投影于幕布' },
                  { char: '雕', title: '雕刻工艺', desc: '阳刻阴刻结合，镂空技法' },
                  { char: '唱', title: '唱腔音乐', desc: '各地流派唱腔独特' },
                  { char: '演', title: '操纵技法', desc: '三根竹签操纵影人' },
                ].map(item => (
                  <div key={item.char} className="bg-white/10 backdrop-blur-sm p-4 rounded-sm">
                    <div className="text-vermilion text-3xl mb-2">{item.char}</div>
                    <h3 className="font-xiaowei text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-rice-paper/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white rounded-sm p-8 card-shadow relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-xiaowei text-2xl">修习档案</h2>
            <span className="text-sm text-gray-400 font-sans">上次更新: 今日 14:30</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: '12.5', label: '修习小时', color: 'text-ink-black' },
              { value: '85%', label: '动作准确率', color: 'text-vermilion' },
              { value: '3', label: '掌握技法', color: 'text-cyan-glaze' },
              { value: 'Lv.2', label: '传承等级', color: 'text-ink-black' },
            ].map(item => (
              <div key={item.label} className="text-center p-4 border-r border-gray-100 last:border-0">
                <div className={`text-4xl font-serif ${item.color} mb-2`}>{item.value}</div>
                <div className="text-xs text-charcoal/60 tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ink-black text-rice-paper py-12 border-t-4 border-vermilion">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rice-paper text-ink-black flex items-center justify-center font-calligraphy text-2xl rounded-sm">
              承
            </div>
            <div>
              <h4 className="font-xiaowei text-xl">数字传承人</h4>
              <p className="text-xs text-charcoal/60 font-sans">非遗工艺流程交互教学与复原系统</p>
            </div>
          </div>
          <div className="text-charcoal/60 text-sm font-sans text-center md:text-right">
            <p>© 2026 The Digital Inheritor Project.</p>
            <p>Designed for Chinese Collegiate Computing Competition.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
