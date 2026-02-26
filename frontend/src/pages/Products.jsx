import React, { useEffect, useMemo, useState } from 'react'
import Section from '../components/Section'
import ProductCard from '../components/ProductCard'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'
import { useCart } from '../state/cart'

export default function Products() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const { items } = useCart()

  useEffect(() => {
    (async () => {
      try {
        setProducts(await api.listProducts(true))
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(p => (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().includes(q))
  }, [products, query])

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Order</div>
          <h1 className="bb-h1 mt-3">Products</h1>

          <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              className="bb-input md:max-w-sm"
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Link className="bb-btn bb-btn-accent" to="/cart">Go to cart ({items.length})</Link>
          </div>

          {error && <div className="mt-6 text-sm text-cherry">{error}</div>}
        </div>
      </section>

      <Section eyebrow="Catalog" title="Choose your lineup.">
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </Section>
    </>
  )
}
