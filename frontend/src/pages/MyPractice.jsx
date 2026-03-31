import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import useLocalStorage from '../hooks/useLocalStorage';

const MyPractice = () => {
  const [sessions] = useLocalStorage('vision_sessions', []);
  const [profile] = useLocalStorage('user_profile', { certificates: [] });
  const navigate = useNavigate();

  // Calculate stats from sessions
  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions)
    : 0;

  // Calculate total practice time (sum of duration, convert to hours)
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Skills mastered: scenarios with avg score >= 80
  const skillsMap = {};
  sessions.forEach(s => {
    if (!skillsMap[s.scenario]) skillsMap[s.scenario] = [];
    skillsMap[s.scenario].push(s.score);
  });
  const masteredSkills = Object.values(skillsMap).filter(scores =>
    scores.length >= 3 && (scores.reduce((a, b) => a + b, 0) / scores.length) >= 80
  ).length;

  // Completed works: sessions with score >= 85
  const completedWorks = sessions.filter(s => s.score >= 85).length;

  // Derive level
  const getLevel = () => {
    if (totalSessions >= 16 && avgScore >= 80) return { level: 3, label: 'Lv.3' };
    if (totalSessions >= 6 && avgScore >= 60) return { level: 2, label: 'Lv.2' };
    return { level: 1, label: 'Lv.1' };
  };
  const { level, label: levelLabel } = getLevel();

  // Recent sessions (last 5)
  const recentSessions = [...sessions].reverse().slice(0, 5);

  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-rice-paper">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-ink-black/10 pb-8">
          <div>
            <h1 className="font-calligraphy text-5xl mb-4 text-ink-black">修习之路</h1>
            <p className="text-charcoal/60 font-serif text-lg tracking-widest">路漫漫其修远兮，吾将上下而求索</p>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <div className="text-6xl font-serif text-vermilion">{levelLabel}</div>
            <div className="text-sm text-charcoal/60 font-sans tracking-widest uppercase">Inheritor Level</div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-sm card-shadow text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-ink-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="text-4xl font-serif mb-2">{totalHours}h</div>
              <div className="text-xs text-charcoal/60 uppercase tracking-widest">总修习时长</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-sm card-shadow text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-vermilion/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="text-4xl font-serif mb-2 text-vermilion">{avgScore}%</div>
              <div className="text-xs text-charcoal/60 uppercase tracking-widest">平均准确率</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-sm card-shadow text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-glaze/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="text-4xl font-serif mb-2 text-cyan-glaze">{masteredSkills}</div>
              <div className="text-xs text-charcoal/60 uppercase tracking-widest">掌握技法</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-sm card-shadow text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-tea-green/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="text-4xl font-serif mb-2 text-ink-black/80">{completedWorks}</div>
              <div className="text-xs text-charcoal/60 uppercase tracking-widest">完成作品</div>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions */}
        <h2 className="font-xiaowei text-3xl mb-8 border-l-4 border-vermilion pl-4">最近练习</h2>

        {recentSessions.length === 0 ? (
          <div className="bg-white p-12 rounded-sm card-shadow text-center mb-16">
            <p className="text-charcoal/60 font-serif text-lg mb-4">还没有练习记录</p>
            <Button onClick={() => navigate('/vision-mentor')}>开始练习</Button>
          </div>
        ) : (
          <div className="space-y-4 mb-16">
            {recentSessions.map(session => (
              <div key={session.id} className="bg-white p-5 rounded-sm card-shadow flex flex-col md:flex-row gap-4 items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                  🐰
                </div>
                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-xiaowei text-lg text-ink-black">皮影 · 飞兔手影</h3>
                      <p className="text-xs text-charcoal/60">练习时间: {formatTime(session.timestamp)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-sm font-bold ${
                      session.score >= 85 ? 'bg-green-100 text-green-700' :
                      session.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {session.score}分
                    </div>
                  </div>
                </div>
                <Button className="text-sm px-4 py-2" onClick={() => navigate('/vision-mentor')}>
                  继续练习
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Certificates */}
        <h2 className="font-xiaowei text-3xl mb-8 border-l-4 border-tea-green pl-4">我的证书</h2>
        {profile.certificates && profile.certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.certificates.map((cert, idx) => (
              <div key={idx} className="border-4 border-double border-ink-black/10 p-8 bg-rice-paper text-center relative overflow-hidden group cursor-pointer hover:border-vermilion/30 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-vermilion/10 rounded-bl-full"></div>
                <div className="font-calligraphy text-4xl mb-4 text-ink-black">{cert.name}</div>
                <p className="text-sm text-charcoal/60 mb-6 font-serif">{cert.description}</p>
                <div className="text-xs text-charcoal/40 font-sans tracking-widest">{cert.date}</div>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-vermilion text-sm font-bold">点击下载</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-4 border-double border-ink-black/10 p-8 bg-rice-paper text-center">
            <p className="text-charcoal/60 font-serif">完成更多练习来解锁证书！</p>
            <p className="text-xs text-charcoal/40 mt-2">皮影戏达到85分以上可获得结业证书</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPractice;
