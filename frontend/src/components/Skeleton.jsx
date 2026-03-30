import React from 'react'

const Skeleton = ({ variant = 'text', className = '', count = 1 }) => {
  const baseClass = 'animate-pulse bg-gray-200 rounded'

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'w-12 h-12 rounded-full',
    card: 'w-full h-48 rounded-xl',
    image: 'w-full h-40 rounded-lg',
    button: 'h-10 w-24 rounded',
  }

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClass} ${variants[variant]} ${className}`}
    />
  ))

  return count === 1 ? items[0] : <div className="space-y-3">{items}</div>
}

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <Skeleton variant="image" className="mb-4" />
    <Skeleton variant="title" className="mb-2" />
    <Skeleton variant="text" className="mb-1" />
    <Skeleton variant="text" className="w-2/3" />
  </div>
)

export const SkeletonList = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" />
          <Skeleton variant="text" />
        </div>
      </div>
    ))}
  </div>
)

export const SkeletonChart = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <Skeleton variant="title" className="mb-4" />
    <div className="flex items-end justify-between h-40 gap-2">
      {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
        <Skeleton key={i} variant="text" className="flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
)

export default Skeleton
