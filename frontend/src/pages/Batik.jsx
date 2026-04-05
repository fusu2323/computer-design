import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import BatikImg from '../assets/Batik.png';

const Batik = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#0A192F] font-serif overflow-hidden">
      <Navbar />

      {/* Hero Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          {/* Simulated Batik Ice Crack Background */}
          <div className="absolute inset-0 bg-[#1F3C88] opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
          </div>
        </motion.div>

        <div className="relative z-10 text-center px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h4 className="text-[#1F3C88] font-sans tracking-[0.5em] text-sm md:text-base uppercase mb-6">
              蓝与白的冰雪奇缘
            </h4>
            <h1 className="font-calligraphy text-[120px] md:text-[180px] leading-none text-[#1F3C88] drop-shadow-2xl">
              蜡染
            </h1>
            <div className="w-24 h-1 bg-[#1F3C88] mx-auto my-8"></div>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#3A4B6F] font-xiaowei leading-loose">
              古称“蜡缬”，是中国古老的防染工艺。<br/>
              在苗族等少数民族中世代相传，被誉为“穿在身上的历史”。
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[#1F3C88] text-xs font-sans tracking-widest uppercase">向下探索</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#1F3C88] to-transparent animate-pulse"></div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="py-32 relative bg-white rounded-t-[4rem] md:rounded-t-[8rem] shadow-[0_-20px_50px_rgba(31,60,136,0.05)] z-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Image Frame with Batik border effect */}
            <div className="p-4 bg-white shadow-xl rounded-xl transform -rotate-2 border border-[#E2E8F0]">
              <div className="border-2 border-[#1F3C88] p-2 rounded-lg">
                <img 
                  src={BatikImg} 
                  alt="蜡染技艺" 
                  className="w-full h-auto object-cover rounded shadow-inner filter contrast-125 saturate-110"
                />
              </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 bg-[#1F3C88] text-white p-8 rounded-full w-40 h-40 flex items-center justify-center text-center shadow-2xl">
              <span className="font-calligraphy text-4xl">冰裂纹</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-xiaowei text-4xl text-[#0A192F] mb-8 relative inline-block">
              工艺之美
              <span className="absolute bottom-0 left-0 w-1/2 h-4 bg-[#1F3C88]/10 -z-10"></span>
            </h2>

            <div className="space-y-10">
              {[
                { name: "画蜡", desc: "用铜制蜡刀蘸熔化的蜂蜡，在白布上绘制图案。" },
                { name: "染色", desc: "将画好蜡的布浸入靛蓝染缸中，反复浸染。" },
                { name: "脱蜡", desc: "用沸水煮布，使蜡融化脱落，显现出蓝白相间的图案。" }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#1F3C88] text-[#1F3C88] flex items-center justify-center font-sans font-bold group-hover:bg-[#1F3C88] group-hover:text-white transition-colors duration-300">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#0A192F] mb-2">{step.name}</h3>
                    <p className="text-[#4A5568] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-[#E2E8F0]">
              <p className="font-serif italic text-lg text-[#1F3C88] mb-8 leading-loose border-l-4 border-[#1F3C88] pl-6 bg-[#F0F4F8]/50 py-4">
                "蜡染最迷人之处在于其独特的『冰裂纹』。<br/>
                这是在染色过程中蜡块龟裂，染液渗入而自然形成的肌理，每一幅作品都独一无二。"
              </p>
              
              <Button 
                onClick={() => navigate('/knowledge-curator')} 
                className="bg-[#1F3C88] text-white hover:bg-[#0A192F] px-8 py-4 font-sans tracking-widest rounded-full w-full sm:w-auto"
              >
                探索蜡染图谱
              </Button>
            </div>
          </motion.div>
          
        </div>
      </section>
    </div>
  );
};

export default Batik;