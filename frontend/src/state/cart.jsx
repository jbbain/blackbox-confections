import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartCtx = createContext(null)

function load() {
  try { return JSON.parse(localStorage.getItem('bb_cart') || '[]') } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    localStorage.setItem('bb_cart', JSON.stringify(items))
  }, [items])

  const add = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
        return copy
      }
      return [...prev, { product, quantity: qty }]
    })
  }

  const remove = (productId) => setItems(prev => prev.filter(i => i.product.id !== productId))
  const setQty = (productId, qty) => setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, qty) } : i))
  const clear = () => setItems([])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0), [items])

  const value = useMemo(() => ({ items, add, remove, setQty, clear, subtotal }), [items, subtotal])
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
