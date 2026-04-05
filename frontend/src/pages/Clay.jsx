import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import PurpleClay from '../assets/Purple-Clay.png';

const Clay = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#3D332B] font-serif overflow-hidden">
      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto min-h-screen flex flex-col justify-center relative">
        {/* Background Zen Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#E5E0D8] opacity-50 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#E5E0D8] opacity-30 -z-10"></div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-5 order-2 lg:order-1 relative"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-t-full rounded-b-md shadow-2xl relative">
              <div className="absolute inset-0 bg-[#8B5E34] opacity-10 mix-blend-color z-10"></div>
              <img 
                src={PurpleClay} 
                alt="宜兴紫砂" 
                className="w-full h-full object-cover grayscale-[20%]"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute -right-8 bottom-24 bg-[#FAF9F6] p-6 shadow-xl max-w-[240px] border-l-4 border-[#8B5E34]"
            >
              <h4 className="font-xiaowei text-xl mb-2 text-[#8B5E34]">泥与火的交响</h4>
              <p className="text-sm text-[#6C5B4E] leading-relaxed">
                宜兴紫砂泥独特的双气孔结构，使其成为泡茶的绝佳器具。
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-7 order-1 lg:order-2 pl-0 lg:pl-12"
          >
            <div className="flex items-center gap-6 mb-8">
              <span className="w-16 h-px bg-[#8B5E34]"></span>
              <span className="tracking-[0.4em] text-[#8B5E34] text-sm uppercase">YIXING CLAY TEAPOT</span>
            </div>
            
            <h1 className="font-calligraphy text-7xl md:text-8xl lg:text-9xl mb-12 text-[#2A231E]">
              紫砂
            </h1>
            
            <div className="prose prose-lg text-[#5A4B40] leading-loose mb-12 max-w-2xl">
              <p>
                紫砂壶起源于宋代，盛行于明清。一把好的紫砂壶，讲究“泥、形、工、款、功”。泥料要纯正，造型要古朴，做工要精细，出水要流畅。
              </p>
              <p className="mt-4">
                它不施釉，透气性好，泥片镶接成型，全凭匠人手感，蕴含着浓厚的文人雅趣与茶道精神。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12 border-t border-[#E5E0D8] pt-8">
              <div>
                <h3 className="font-xiaowei text-2xl text-[#8B5E34] mb-3">打泥片</h3>
                <p className="text-[#6C5B4E] text-sm leading-relaxed">将紫砂泥打制成厚薄均匀的泥片，是成型的基础。</p>
              </div>
              <div>
                <h3 className="font-xiaowei text-2xl text-[#8B5E34] mb-3">镶接成型</h3>
                <p className="text-[#6C5B4E] text-sm leading-relaxed">将泥片拼接成壶身，不借助模具，全凭匠人手感。</p>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/knowledge-curator')} 
              className="bg-[#8B5E34] text-white hover:bg-[#6A4727] px-10 py-4 font-sans tracking-widest text-sm"
            >
              探索大师坊
            </Button>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Clay;