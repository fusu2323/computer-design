import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import SuEmbroidery from '../assets/Suzhou-embroidery.png';

const Embroidery = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3E3D] selection:bg-[#D98C85] selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[90vh] flex items-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#F4EAE6] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-[#E6F0F4] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

        <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-[#D98C85]"></span>
              <span className="text-[#D98C85] tracking-[0.3em] text-sm font-sans uppercase">江南水乡的指尖魔法</span>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <h1 className="font-calligraphy text-7xl md:text-9xl mb-6 text-[#2C2423] leading-none">
                苏绣
              </h1>
              <span className="absolute -top-6 -right-12 font-calligraphy text-8xl text-[#F4EAE6] -z-10 select-none">绣</span>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-xl font-serif leading-relaxed mb-10 text-[#5C4F4E]">
              以针作画，以线交织。苏绣发源于苏州，是四大名绣之一。已有2000多年历史，以其针法精细、色彩雅致而闻名于世。
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex gap-6">
              <Button 
                onClick={() => navigate('/vision-mentor?scenario=embroidery')} 
                className="bg-[#D98C85] text-white hover:bg-[#C27972] rounded-none px-8 py-4 tracking-widest"
              >
                体验 AI 导师
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 border border-[#D98C85] transform translate-x-4 translate-y-4"></div>
            <img 
              src={SuEmbroidery} 
              alt="苏绣艺术" 
              className="w-full h-auto object-cover relative z-10 shadow-2xl"
            />
            
            {/* Floating Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -left-8 bottom-12 bg-white p-4 shadow-xl z-20 max-w-[200px]"
            >
              <p className="font-serif text-sm italic text-[#5C4F4E]">"平、齐、细、密、和、光、顺、匀"</p>
              <div className="w-8 h-px bg-[#D98C85] mt-3"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "平针",
                desc: "最基础的针法，线条排列均匀齐整。起落针都要在轮廓线边缘，不可参差不齐。",
                num: "01"
              },
              {
                title: "乱针",
                desc: "运用长短参差的线条交叉组织，表现色彩层次，富有立体感，宛如油画般的质感。",
                num: "02"
              },
              {
                title: "套针",
                desc: "丝线交错嵌套，一圈套一圈，适合表现花鸟羽毛的过渡色，自然逼真。",
                num: "03"
              }
            ].map((tech, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="group border border-[#F4EAE6] p-8 hover:border-[#D98C85] transition-colors duration-500"
              >
                <div className="text-5xl font-calligraphy text-[#F4EAE6] mb-6 group-hover:text-[#D98C85] transition-colors">{tech.num}</div>
                <h3 className="text-2xl font-xiaowei mb-4">{tech.title}</h3>
                <p className="font-serif text-[#5C4F4E] leading-relaxed">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Embroidery;