import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import ProductCard from '../components/ProductCard'
import RatingStars from '../components/RatingStars'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const [p, r] = await Promise.all([api.listProducts(true), api.listReviews(true)])
        setProducts(p.slice(0, 3))
        setReviews(r.slice(0, 3))
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [])

  return (
    <>
      <section className="pt-16 pb-10">
        <div className="bb-container">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="bb-label text-cherry">Luxury baked goods</div>
              <h1 className="bb-h1 mt-3">
                Minimal form. <span className="text-cherry">Maximum</span> flavor.
              </h1>
              <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-2xl">
                BlackBox Confections delivers premium cakes and baked goods with a refined, editorial aesthetic.
                Cherry-red accents. Sharp corners. No noise.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/products" className="bb-btn bb-btn-accent">Order Now</Link>
                <Link to="/gallery" className="bb-btn">View Gallery</Link>
              </div>
            </div>
            <div className="md:col-span-4">
              <div className="bb-card p-6">
                <div className="bb-label">Signature</div>
                <div className="font-display text-2xl mt-2 leading-tight">Black Velvet Collection</div>
                <p className="text-sm bb-muted mt-3 leading-relaxed">
                  Cocoa-forward, ganache-finished, and crafted for the spotlight.
                </p>
                <div className="bb-divider my-5" />
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest opacity-70">This week</div>
                  <div className="text-xs uppercase tracking-widest text-cherry">Limited</div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="mt-8 text-sm text-cherry">{error}</div>}
        </div>
      </section>

      <Section
        eyebrow="Featured"
        title="Baked goods, curated."
        right={<Link className="bb-btn" to="/products">See all</Link>}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </Section>

      <Section
        eyebrow="Testimonials"
        title="Quiet confidence, loud results."
        right={<Link className="bb-btn" to="/contact">Request a custom order</Link>}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.id} className="bb-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="font-display text-lg">{r.name}</div>
                <RatingStars rating={r.rating} />
              </div>
              <p className="mt-3 text-sm bb-muted leading-relaxed">{r.message}</p>
              <div className="mt-5 text-xs uppercase tracking-widest opacity-60">Verified customer</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
