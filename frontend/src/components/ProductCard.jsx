import React from 'react'
import { useCart } from '../state/cart'

export default function ProductCard({ p }) {
  const { add } = useCart()
  return (
    <div className="bb-card p-5">
      <div className="aspect-[4/3] bg-black/5 dark:bg-white/5 overflow-hidden">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs uppercase tracking-widest opacity-60">No image</div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-xl leading-tight">{p.name}</div>
          <div className="text-xs uppercase tracking-widest opacity-70 mt-1">{p.category}</div>
        </div>
        <div className="text-right">
          <div className="text-sm uppercase tracking-widest opacity-70">Price</div>
          <div className="font-display text-xl">${p.price.toFixed(2)}</div>
        </div>
      </div>
      <p className="text-sm bb-muted mt-3 leading-relaxed">{p.description}</p>
      <div className="mt-5 flex gap-3">
        <button className="bb-btn bb-btn-accent w-full" onClick={() => add(p, 1)}>
          Add to cart
        </button>
      </div>
    </div>
  )
}
