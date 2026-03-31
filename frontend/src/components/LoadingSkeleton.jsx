import React from 'react';

/**
 * Reusable shimmer loading skeleton component with variants for page, card, text, avatar.
 * Uses rice-paper color with ink-black shimmer animation.
 */
const LoadingSkeleton = ({
  variant = 'text',
  count = 1,
  className = '',
}) => {
  // Base shimmer style
  const shimmerBase = 'bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] animate-shimmer';

  // Skeleton base
  const skeletonBase = 'bg-ink-black/5 rounded-sm';

  const renderSkeleton = (index) => {
    switch (variant) {
      case 'page':
        return (
          <div key={index} className="min-h-screen w-full p-8 space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-4 pb-4 border-b border-ink-black/10">
              <div className={`${skeletonBase} ${shimmerBase} w-12 h-12 rounded-full`} />
              <div className="space-y-2 flex-1">
                <div className={`${skeletonBase} ${shimmerBase} h-4 w-1/3 rounded`} />
                <div className={`${skeletonBase} ${shimmerBase} h-3 w-1/4 rounded`} />
              </div>
            </div>
            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className={`${skeletonBase} ${shimmerBase} h-40 w-full rounded`} />
                  <div className={`${skeletonBase} ${shimmerBase} h-4 w-3/4 rounded`} />
                  <div className={`${skeletonBase} ${shimmerBase} h-3 w-1/2 rounded`} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'card':
        return (
          <div key={index} className="bg-white rounded-sm p-6 space-y-4">
            <div className={`${skeletonBase} ${shimmerBase} h-40 w-full rounded`} />
            <div className={`${skeletonBase} ${shimmerBase} h-5 w-3/4 rounded`} />
            <div className={`${skeletonBase} ${shimmerBase} h-3 w-full rounded`} />
            <div className={`${skeletonBase} ${shimmerBase} h-3 w-2/3 rounded`} />
          </div>
        );

      case 'avatar':
        return (
          <div key={index} className={`${skeletonBase} ${shimmerBase} w-12 h-12 rounded-full`} />
        );

      case 'text':
      default:
        // Text lines with decreasing width
        const widths = ['w-full', 'w-[80%]', 'w-[60%]'];
        return (
          <div key={index} className="space-y-2">
            {[0, 1, 2].slice(0, count).map((lineIndex) => (
              <div
                key={lineIndex}
                className={`${skeletonBase} ${shimmerBase} h-4 ${widths[lineIndex]} rounded`}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`${className}`} style={{ overflow: 'hidden' }}>
      {count === 1
        ? renderSkeleton(0)
        : <div className="space-y-4">{Array.from({ length: count }, (_, i) => renderSkeleton(i))}</div>
      }
    </div>
  );
};

export default LoadingSkeleton;
