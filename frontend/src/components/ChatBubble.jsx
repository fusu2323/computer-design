/**
 * ChatBubble Component
 * Standardized chat message bubble for KnowledgeCurator interface
 */

import React from 'react';
import { motion } from 'framer-motion';
import { slideRight, slideLeft } from '../animations/variants';

const ChatBubble = ({
  role,
  content,
  status = 'sent',
  timestamp,
  className = '',
}) => {
  const isUser = role === 'user';

  // Typing indicator dots
  const TypingDots = () => (
    <span className="flex gap-1 items-center px-2">
      <motion.span
        className="w-2 h-2 bg-current rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-2 h-2 bg-current rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-current rounded-full"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </span>
  );

  const userBubbleClasses = [
    'bg-vermilion text-rice-paper',
    'rounded-ee-sm rounded-es-lg',
    'max-w-[70%] ml-auto',
  ].join(' ');

  const assistantBubbleClasses = [
    'bg-ink-black/5 text-ink-black',
    'rounded-es-sm rounded-ee-lg',
    'max-w-[70%] mr-auto',
  ].join(' ');

  const bubbleVariants = isUser ? slideRight : slideLeft;

  const bubbleStyle = isUser
    ? { transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }
    : { transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } };

  return (
    <motion.div
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${className}`}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      {...bubbleStyle}
    >
      <div className={isUser ? userBubbleClasses : assistantBubbleClasses}>
        {status === 'sending' ? (
          <div className="px-4 py-3">
            <TypingDots />
          </div>
        ) : status === 'error' ? (
          <div className="px-4 py-3 flex items-center gap-2">
            <span className="text-red-300 font-bold">!</span>
            <span>{content}</span>
          </div>
        ) : (
          <div className="px-4 py-3">
            {typeof content === 'string' ? (
              <span className="font-serif">{content}</span>
            ) : (
              content
            )}
          </div>
        )}
      </div>

      {timestamp && (
        <span className="text-xs text-charcoal/50 mt-1 px-2 font-serif">
          {timestamp}
        </span>
      )}
    </motion.div>
  );
};

export default ChatBubble;
