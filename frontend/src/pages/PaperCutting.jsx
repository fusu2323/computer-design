import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import PaperCuttingImg from '../assets/Paper-Cutting.png';

const PaperCutting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F8] text-[#1A1A1A] font-serif">
      <Navbar />

      {/* Hero Section with Grid Layout */}
      <section className="pt-24 min-h-screen grid grid-cols-1 md:grid-cols-2 relative">
        {/* Left Side: Text & Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 z-10 bg-white shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)]"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="bg-[#D32F2F] text-white text-xs tracking-widest uppercase px-3 py-1 font-sans font-bold">
              中国剪纸
            </span>
            <span className="text-[#D32F2F] text-sm tracking-widest font-sans">
              镂空艺术的极致展现
            </span>
          </div>

          <h1 className="font-calligraphy text-8xl md:text-9xl mb-8 text-[#111] leading-none">
            剪<br/>纸
          </h1>

          <div className="w-12 h-1 bg-[#D32F2F] mb-8"></div>

          <p className="text-xl leading-loose text-[#444] mb-12 font-xiaowei">
            中国最古老的民间艺术之一，最早可追溯到汉代。<br/>
            它以纸为载体，剪刀或刻刀为工具，创作出千变万化的镂空艺术，寄托了人们对美好生活的向往。
          </p>

          <div className="space-y-6 mb-12 font-sans">
            <div className="flex items-start gap-4">
              <span className="text-[#D32F2F] font-bold text-lg mt-1">01.</span>
              <div>
                <h4 className="font-bold text-[#111]">阳刻</h4>
                <p className="text-sm text-[#666] mt-1">保留轮廓线，剪去多余部分，线条相连，犹如线描。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#D32F2F] font-bold text-lg mt-1">02.</span>
              <div>
                <h4 className="font-bold text-[#111]">阴刻</h4>
                <p className="text-sm text-[#666] mt-1">刻去轮廓线，保留大块面，线条断开，浑厚凝重。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#D32F2F] font-bold text-lg mt-1">03.</span>
              <div>
                <h4 className="font-bold text-[#111]">折剪</h4>
                <p className="text-sm text-[#666] mt-1">将纸折叠后剪制，展开后形成对称图案，极具几何美感。</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/creative-workshop')} 
            className="bg-[#111] text-white hover:bg-[#D32F2F] self-start px-8 py-4 font-sans tracking-widest rounded-sm transition-colors duration-300"
          >
            开启创意工坊
          </Button>
        </motion.div>

        {/* Right Side: Visual */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative hidden md:flex items-center justify-center bg-[#D32F2F] overflow-hidden"
        >
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)' }}></div>
          
          <motion.div 
            initial={{ scale: 0.8, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-3/4 max-w-lg"
          >
            <div className="absolute inset-0 bg-white translate-x-4 translate-y-4 rounded-sm"></div>
            <img 
              src={PaperCuttingImg} 
              alt="中国剪纸" 
              className="w-full h-auto object-cover relative z-10 border-4 border-white shadow-2xl grayscale-[30%] contrast-125 mix-blend-multiply"
            />
          </motion.div>

          <div className="absolute bottom-12 right-12 text-white/50 font-calligraphy text-9xl select-none pointer-events-none">
            福
          </div>
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-[#111] text-white text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-[#D32F2F] text-6xl font-serif mb-6">"</div>
          <p className="text-3xl md:text-4xl font-xiaowei leading-relaxed mb-8">
            千刻不落，万剪不断。<br/>
            图案寓意吉祥，线条流畅生动，构图饱满匀称。
          </p>
          <p className="text-white/50 tracking-widest text-sm uppercase font-sans">
            剪纸鉴赏指南
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default PaperCutting;