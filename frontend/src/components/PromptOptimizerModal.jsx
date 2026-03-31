/**
 * PromptOptimizerModal - AI 提示词优化对话浮窗
 *
 * 交互流程：
 * 1. 打开弹窗 → AI 立刻主动打招呼，引导用户描述创意
 * 2. 用户描述 → AI 实时总结已选内容，询问是否需要补充
 * 3. 用户可"采纳"总结结果，或继续优化
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// XSS 过滤：HTML 实体转义
const sanitize = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// 截断文本（最大 512 字符）
const truncate = (text, maxLen = 512) => {
  if (!text || text.length <= maxLen) return { truncated: text, isTruncated: false };
  return { truncated: text.slice(0, maxLen), isTruncated: true };
};

// 初始引导消息（由 AI 主动说出，不作为用户消息）
const buildInitialPrompt = (projectCoreTheme) =>
  `你好！我是你的 AI 提示词优化助手。

核心创作主题是：「${projectCoreTheme}」

请简单描述你想要的创作内容，比如：
- 你想画什么场景或人物？
- 希望呈现什么艺术风格（水墨风、工笔风、插画风、融合风…）？
- 想传达什么样的情感氛围（庄重典雅、温馨亲切、神秘古朴…）？

直接告诉我你的想法，我会帮你整理成一个高质量的 AI 绘画提示词。`;

const PromptOptimizerModal = ({ isOpen, onClose, onAdopt, projectCoreTheme }) => {
  // --- Refs ---
  const messagesRef = useRef([]); // 对话历史
  const abortControllerRef = useRef(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const isStreamingRef = useRef(false);

  // 拖拽 refs
  const modalRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const modalPosRef = useRef({ x: 0, y: 0 });

  // 缩放 refs
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const modalSizeRef = useRef({ w: 480, h: 640 });

  // --- State ---
  const [messages, setMessages] = useState([]); // [{role, content}]
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [isTruncated, setIsTruncated] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 480, h: 640 });
  const [initializing, setInitializing] = useState(false); // 是否正在发送初始引导

  // 打开弹窗时：AI 立刻主动打招呼
  useEffect(() => {
    if (!isOpen) return;

    // 每次打开都强制重置——防止历史污染
    messagesRef.current = [];
    fullContentRef.current = '';
    setMessages([]);
    setInputValue('');
    setError('');
    setDisplayContent('');
    setIsTruncated(false);
    setShowFull(false);
    setIsStreaming(false);
    setInitializing(true);
    setPosition({ x: 0, y: 0 });
    setSize({ w: 480, h: 640 });
    modalPosRef.current = { x: 0, y: 0 };
    modalSizeRef.current = { w: 480, h: 640 };

    setTimeout(() => inputRef.current?.focus(), 100);
    triggerAIIntro();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isStreamingRef.current = false;
    };
  }, [isOpen]);

  // 自动滚动到底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 初始引导消息累加器（用 ref 避免闭包问题）
  const fullContentRef = useRef('');

  // AI 主动打招呼
  const triggerAIIntro = useCallback(async () => {
    const initialPrompt = buildInitialPrompt(projectCoreTheme || '非遗创意主题');

    // 把 AI 欢迎消息加入，带 tag 标记为引导消息（不参与后续对话上下文）
    messagesRef.current.push({ role: 'assistant', content: '', isGuide: true });
    setMessages([...messagesRef.current]);

    fullContentRef.current = '';
    isStreamingRef.current = true;
    setIsStreaming(true);
    setError('');

    let assistantContent = '';
    let buffer = '';

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('http://localhost:8002/api/deepseek/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `你是一位专业、友善的非遗数字文创提示词优化助手。请始终围绕核心主题「${projectCoreTheme || '非遗创意主题'}」引导用户完善创意描述，最终生成一个包含主题 + 艺术风格 + 情感氛围 + 细节元素的高质量中文提示词。每次回复简洁（100字以内），像朋友聊天一样自然。`,
            },
            {
              role: 'user',
              content: initialPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 512,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('响应体为空');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]' || dataStr === '[DONE]\r') continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.error) throw new Error(data.error);
            const delta = data.choices?.[0]?.delta?.content || '';
            if (delta) {
              assistantContent += delta;
              fullContentRef.current = assistantContent;

              const { truncated, isTruncated: truncatedFlag } = truncate(assistantContent);
              setDisplayContent(sanitize(truncated));
              setIsTruncated(truncatedFlag);

              messagesRef.current[messagesRef.current.length - 1] = {
                role: 'assistant',
                content: assistantContent,
              };
              setMessages([...messagesRef.current]);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('优化服务暂不可用，请稍后再试');
        messagesRef.current = messagesRef.current.slice(0, -1);
        setMessages([...messagesRef.current]);
      }
    } finally {
      isStreamingRef.current = false;
      setIsStreaming(false);
      setInitializing(false);
      abortControllerRef.current = null;
    }
  }, [projectCoreTheme]);

  // displayContent 的 state（打字机效果用）
  const [displayContent, setDisplayContent] = useState('');

  // 发送用户消息
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isStreamingRef.current) return;

      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      isStreamingRef.current = false;

      // 加入用户消息
      messagesRef.current.push({ role: 'user', content: content.trim() });
      setMessages([...messagesRef.current]);
      setInputValue('');
      setError('');

      fullContentRef.current = '';
      setDisplayContent('');

      // AI 开始回复
      messagesRef.current.push({ role: 'assistant', content: '' });
      setMessages([...messagesRef.current]);

      isStreamingRef.current = true;
      setIsStreaming(true);

      let assistantContent = '';
      let buffer = '';

      try {
        abortControllerRef.current = new AbortController();

        // 构建对话上下文：排除引导消息（isGuide=true），避免历史污染
        const chatMessages = messagesRef.current
          .filter((m) => !m.isGuide && m.content && m.content.trim().length > 0)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch('http://localhost:8002/api/deepseek/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `你是一位专业、友善的非遗数字文创提示词优化助手。请始终围绕核心主题「${projectCoreTheme || '非遗创意主题'}」引导用户完善创意描述，最终生成一个包含主题 + 艺术风格 + 情感氛围 + 细节元素的高质量中文提示词。每次回复简洁（100字以内），像朋友聊天一样自然。当用户表示满意或完成时，给出一个格式化的最终提示词总结（加粗标注「最终提示词：」）。`,
              },
              ...chatMessages,
            ],
            temperature: 0.7,
            max_tokens: 512,
            stream: true,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!response.body) throw new Error('响应体为空');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]' || dataStr === '[DONE]\r') continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              const delta = data.choices?.[0]?.delta?.content || '';
              if (delta) {
                assistantContent += delta;
                fullContentRef.current = assistantContent;

                const { truncated, isTruncated: truncatedFlag } = truncate(assistantContent);
                setDisplayContent(sanitize(truncated));
                setIsTruncated(truncatedFlag);

                messagesRef.current[messagesRef.current.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                  isGuide: messagesRef.current[messagesRef.current.length - 1].isGuide,
                };
                setMessages([...messagesRef.current]);
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('优化服务暂不可用，请稍后再试');
          messagesRef.current = messagesRef.current.slice(0, -1);
          setMessages([...messagesRef.current]);
        }
      } finally {
        isStreamingRef.current = false;
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [projectCoreTheme]
  );

  // 采纳：提取最终提示词
  const handleAdopt = useCallback(() => {
    if (messagesRef.current.length === 0) return;
    const lastMsg = messagesRef.current[messagesRef.current.length - 1];
    if (lastMsg.role !== 'assistant' || !lastMsg.content) return;

    // 尝试提取"最终提示词："后面的内容
    const content = lastMsg.content;
    const match = content.match(/最终提示词[：:]\s*([\s\S]*)$/);
    const finalPrompt = match ? match[1].trim() : content.trim();

    onAdopt(finalPrompt);
  }, [onAdopt]);

  // 重新生成
  const handleRegenerate = useCallback(() => {
    if (messagesRef.current.length < 2) return;
    // 移除最后一条 AI 回复，保留用户消息，重新发送最后一条用户消息
    const lastUserIdx = [...messagesRef.current]
      .reverse()
      .findIndex((m) => m.role === 'user');
    if (lastUserIdx <= 0) return;

    const userMsg = messagesRef.current[messagesRef.current.length - 1 - lastUserIdx];
    messagesRef.current = messagesRef.current.slice(0, -(lastUserIdx + 1));
    setMessages([...messagesRef.current]);
    sendMessage(userMsg.content);
  }, [sendMessage]);

  // 继续优化
  const handleContinue = useCallback(() => {
    sendMessage('请继续优化上面的提示词，或者根据我的反馈进一步调整。');
  }, [sendMessage]);

  // 键盘发送
  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!isStreamingRef.current && inputValue.trim()) {
          sendMessage(inputValue);
        }
      }
    },
    [inputValue, sendMessage]
  );

  // 拖拽
  const handleDragMouseDown = useCallback((e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.modal-actions')) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - modalPosRef.current.x,
      y: e.clientY - modalPosRef.current.y,
    };
    document.addEventListener('mousemove', handleDragMouseMove);
    document.addEventListener('mouseup', handleDragMouseUp);
  }, []);

  const handleDragMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    modalPosRef.current = {
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y,
    };
    setPosition({ ...modalPosRef.current });
  }, []);

  const handleDragMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleDragMouseMove);
    document.removeEventListener('mouseup', handleDragMouseUp);
  }, [handleDragMouseMove]);

  // 缩放
  const handleResizeMouseDown = useCallback((e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: modalSizeRef.current.w,
      h: modalSizeRef.current.h,
    };
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  }, []);

  const handleResizeMouseMove = useCallback((e) => {
    if (!isResizingRef.current) return;
    const newW = Math.min(640, Math.max(320, resizeStartRef.current.w + (e.clientX - resizeStartRef.current.x)));
    const newH = Math.min(800, Math.max(400, resizeStartRef.current.h + (e.clientY - resizeStartRef.current.y)));
    modalSizeRef.current = { w: newW, h: newH };
    setSize({ ...modalSizeRef.current });
  }, []);

  const handleResizeMouseUp = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  }, [handleResizeMouseMove]);

  // Esc 关闭
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const showActions = !isStreaming && lastMsg?.role === 'assistant' && lastMsg.content;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          width: size.w,
          height: size.h,
          maxWidth: 640,
          maxHeight: 800,
          transform: `translate(${position.x}px, ${position.y}px)`,
          zIndex: 101,
        }}
      >
        {/* 标题栏 */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-ink-black text-rice-paper cursor-move select-none flex-shrink-0"
          onMouseDown={handleDragMouseDown}
        >
          <h3 className="font-xiaowei text-base truncate">
            AI 提示词优化 · {projectCoreTheme || '非遗创意主题'}
          </h3>
          <button
            onClick={onClose}
            className="modal-actions w-7 h-7 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center text-lg leading-none ml-2 flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* 错误横幅 */}
        {error && (
          <div className="bg-vermilion text-white text-sm px-4 py-2 flex items-center justify-between flex-shrink-0">
            <span>{error}</span>
            <button onClick={() => setError('')} className="hover:opacity-80">×</button>
          </div>
        )}

        {/* 聊天区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-rice-paper/50">
          {messages.map((msg, idx) => {
            if (msg.role === 'user') {
              return (
                <div key={idx} className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl rounded-br-md bg-green-500 text-white">
                    {sanitize(msg.content)}
                  </div>
                </div>
              );
            }
            if (msg.role === 'assistant') {
              const isLast = idx === messages.length - 1;
              const content = isLast ? (showFull ? sanitize(fullContentRef.current) : displayContent) : sanitize(msg.content);
              const truncatedThis = isLast ? isTruncated : false;

              return (
                <div key={idx} className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl rounded-bl-md bg-white border border-ink-black/10 text-ink-black">
                    <div className="whitespace-pre-wrap break-all">
                      {content}
                      {truncatedThis && !showFull && (
                        <button
                          onClick={() => setShowFull(true)}
                          className="text-vermilion text-sm hover:underline ml-1"
                        >
                          ...展开
                        </button>
                      )}
                      {isLast && isStreaming && (
                        <span className="inline-block w-2 h-4 bg-vermilion ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
          <div ref={chatEndRef} />
        </div>

        {/* 操作按钮（AI 回复完成后） */}
        {showActions && (
          <div className="px-4 py-2 border-t border-ink-black/10 flex gap-2 flex-shrink-0 bg-white">
            <button
              onClick={handleRegenerate}
              className="px-3 py-1.5 text-sm border border-ink-black/20 rounded-lg hover:bg-ink-black/5 transition-colors text-charcoal"
            >
              重新生成
            </button>
            <button
              onClick={handleAdopt}
              className="px-3 py-1.5 text-sm bg-vermilion text-white rounded-lg hover:bg-vermilion/90 transition-colors"
            >
              采纳
            </button>
            <button
              onClick={handleContinue}
              className="px-3 py-1.5 text-sm border border-vermilion text-vermilion rounded-lg hover:bg-vermilion/5 transition-colors"
            >
              继续优化
            </button>
          </div>
        )}

        {/* 输入框 */}
        <div className="p-3 border-t border-ink-black/10 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={isStreaming ? 'AI 正在思考中...' : '描述你的创意想法...'}
              className="flex-1 resize-none border border-ink-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-vermilion max-h-32"
              rows={2}
              disabled={isStreaming}
            />
            <button
              onClick={() => inputValue.trim() && sendMessage(inputValue)}
              disabled={!inputValue.trim() || isStreaming}
              className="px-4 py-2 bg-vermilion text-white rounded-lg hover:bg-vermilion/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              发送
            </button>
          </div>
          <p className="text-xs text-charcoal/40 mt-1.5">
            Enter 发送 · Shift+Enter 换行 · Esc 关闭
          </p>
        </div>

        {/* 缩放把手 */}
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-charcoal/30" fill="currentColor">
            <path d="M14 16H16V14H14V16ZM8 16H16V8H14V16H8Z" />
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PromptOptimizerModal;
