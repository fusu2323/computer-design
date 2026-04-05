import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import SuEmbroidery from '../assets/Suzhou-embroidery.png';
import PurpleClay from '../assets/Purple-Clay.png';
import PaperCutting from '../assets/Paper-Cutting.png';
import Batik from '../assets/Batik.png';
import ShadowPuppetImg from '../assets/Shadow-Puppet.png';

const CraftLibrary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const crafts = [
    {
      id: 1,
      name: "苏绣",
      category: "embroidery",
      image: SuEmbroidery,
      desc: "中国四大名绣之一，以针作画，以线交织，展现江南水乡的温婉与秀美。针法丰富，平齐细密。",
      features: ["江南名绣", "丝线艺术"],
      learners: "基础知识"
    },
    {
      id: 2,
      name: "紫砂壶制作",
      category: "clay",
      image: PurpleClay,
      desc: "宜兴特产，以紫砂泥为原料，不施釉，透气性好。泥片镶接成型，技艺独特，蕴含文人雅趣。",
      features: ["茶道圣品", "泥片镶接"],
      learners: "基础知识"
    },
    {
      id: 3,
      name: "剪纸",
      category: "paper",
      image: PaperCutting,
      desc: "以纸为载体，剪刀或刻刀为工具，创作出千变万化的镂空艺术。寓意吉祥，充满浓郁的民俗风情。",
      features: ["镂空艺术", "民俗文化"],
      learners: "基础知识"
    },
    {
      id: 4,
      name: "蜡染",
      category: "batik",
      image: Batik,
      desc: "利用蜂蜡防染，靛蓝染色，洗去蜡后呈现出独特的冰裂纹。古朴典雅，是苗族等少数民族的传统技艺。",
      features: ["防染工艺", "冰裂纹理"],
      learners: "基础知识"
    },
    {
      id: 5,
      name: "皮影戏",
      category: "shadow",
      image: ShadowPuppetImg,
      desc: "以兽皮刻制影人，在灯光照射下隔亮布操作表演。集雕刻、绘画、音乐、表演于一体的综合艺术。",
      features: ["光影艺术", "戏剧表演"],
      learners: "基础知识"
    }
  ];

  return (
    <div className="min-h-screen bg-rice-paper">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-calligraphy text-5xl mb-4 text-ink-black">非遗基础知识库</h1>
          <p className="text-charcoal/60 font-serif text-lg tracking-widest">探寻千年匠心，了解中华非物质文化遗产</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-8 mb-16 border-b border-ink-black/10 pb-4">
          {['all', 'embroidery', 'clay', 'paper', 'batik', 'shadow'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-xiaowei text-lg pb-2 transition-colors ${
                activeTab === tab
                  ? 'text-vermilion font-bold border-b-2 border-vermilion'
                  : 'text-charcoal/60 hover:text-ink-black'
              }`}
            >
              {tab === 'all' ? '全部' : tab === 'embroidery' ? '苏绣' : tab === 'clay' ? '紫砂' : tab === 'paper' ? '剪纸' : tab === 'batik' ? '蜡染' : '皮影戏'}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crafts.filter(craft => activeTab === 'all' || craft.category === activeTab).map(craft => (
            <Card key={craft.id} className="cursor-pointer group" onClick={() => navigate(craft.category === 'shadow' ? '/shadow-puppet' : `/craft/${craft.category}`)}>
              <div className="absolute top-4 right-4 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-sm font-sans backdrop-blur-sm">热门</div>
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-ink-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img
                  src={craft.image}
                  alt={craft.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 relative">
                <div className="absolute -top-10 left-6 bg-rice-paper border border-ink-black/10 p-2 shadow-sm">
                  <span className="font-calligraphy text-2xl text-vermilion">
                    {craft.name[0]}
                  </span>
                </div>
                <h3 className="font-xiaowei text-2xl mb-2 mt-2 group-hover:text-vermilion transition-colors">
                  {craft.name}
                </h3>
                <p className="text-charcoal/70 text-sm mb-4 line-clamp-2">
                  {craft.desc}
                </p>
                <div className="flex justify-between items-center border-t border-ink-black/5 pt-4">
                  <span className="text-xs text-cyan-glaze font-bold bg-cyan-glaze/10 px-2 py-1 rounded">
                    {craft.features[0]}
                  </span>
                  <span className="text-charcoal/40 text-sm font-serif">{craft.learners} 人修习中</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CraftLibrary;
