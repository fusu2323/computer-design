import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import ChatBubble from '../components/ChatBubble';
import Button from '../components/Button';
import { endpoints } from '../services/endpoints';

const API_BASE = import.meta.env.VITE_API_URL || '';

const MasterWorkshop = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '您好，我是主协调员。我会根据您的需求，智能调度视觉导师、知识馆长或创意艺匠为您服务。请告诉我您想学习什么？',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  // Session initialization from localStorage
  useEffect(() => {
    let stored = localStorage.getItem('orchestrator_session_id');
    if (!stored) {
      stored = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('orchestrator_session_id', stored);
    }
    setSessionId(stored);

    // Load history from localStorage
    const history = JSON.parse(localStorage.getItem('orchestrator_history') || '[]');
    if (history.length > 0) {
      setMessages(prev => {
        const systemMsg = prev[0];
        return [systemMsg, ...history];
      });
    }
  }, []);

  // Save history to localStorage (keep last 50 messages)
  const saveHistory = (msgs) => {
    const toSave = msgs.filter(m => m.role !== 'system').slice(-50);
    localStorage.setItem('orchestrator_history', JSON.stringify(toSave));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Get last 10 messages for context
      const historyContext = messages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch(API_BASE + endpoints.orchestrator.process, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg.content,
          session_id: sessionId,
          history: historyContext
        })
      });

      if (!response.ok) throw new Error('Orchestrator request failed');

      const data = await response.json();

      const agentMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.final_answer || '处理完成',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => {
        const updated = [...prev, agentMsg];
        saveHistory(updated);
        return updated;
      });
    } catch (error) {
      console.error('Orchestrator error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，服务暂时不可用，请稍后再试。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('orchestrator_session_id');
    localStorage.removeItem('orchestrator_history');
    setMessages([{
      id: 1,
      role: 'assistant',
      content: '您好，我是主协调员。我会根据您的需求，智能调度视觉导师、知识馆长或创意艺匠为您服务。请告诉我您想学习什么？',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }]);
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('orchestrator_session_id', newSessionId);
    setSessionId(newSessionId);
  };

  return (
    <div className="h-screen bg-rice-paper flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow flex max-w-5xl mx-auto w-full flex-col pt-24 px-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-ink-black/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-vermilion to-amber-600 rounded-full flex items-center justify-center text-white font-calligraphy text-xl shadow-lg">
              协调
            </div>
            <div>
              <h1 className="font-xiaowei text-xl text-ink-black">主协调员</h1>
              <p className="text-xs text-charcoal/50 font-serif">智能调度 · 意图识别 · 多 Agent 协作</p>
            </div>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-xs text-charcoal/50 hover:text-vermilion transition-colors font-serif flex items-center gap-1 px-3 py-1.5 rounded-sm hover:bg-vermilion/5"
          >
            <span>🗑️</span> 新对话
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white/50 rounded-t-xl p-6 space-y-4">
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
              status={msg.status}
            />
          ))}
          {loading && (
            <ChatBubble
              role="assistant"
              content=""
              status="sending"
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-xl border-t border-ink-black/10 p-4 shadow-lg">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题或需求..."
              className="flex-grow px-4 py-3 border border-ink-black/20 rounded-lg focus:outline-none focus:border-vermilion bg-rice-paper font-serif text-sm"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3"
            >
              {loading ? '发送中...' : '发送'}
            </Button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs text-charcoal/40 font-serif">试试：</span>
            {['教我做皮影戏手势', '苏绣有哪些针法', '生成一个非遗图案'].map(q => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="text-xs bg-ink-black/5 hover:bg-vermilion/10 text-charcoal/70 hover:text-vermilion px-2 py-1 rounded-sm transition-colors font-serif"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MasterWorkshop;
