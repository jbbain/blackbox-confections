import React from 'react'

export default function RatingStars({ rating = 5 }) {
  const full = Math.max(0, Math.min(5, rating))
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'text-cherry' : 'opacity-20'}>★</span>
      ))}
    </div>
  )
}
