import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import { api } from '../lib/api'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setItems(await api.listGallery())
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [])

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Gallery</div>
          <h1 className="bb-h1 mt-3">Editorial, edible.</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            A minimal presentation with premium detail. Add your own images in the Admin dashboard.
          </p>
          {error && <div className="mt-6 text-sm text-cherry">{error}</div>}
        </div>
      </section>

      <Section eyebrow="Collection" title="Signature moments.">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(it => (
            <div key={it.id} className="bb-card overflow-hidden">
              <div className="aspect-[4/3] bg-black/5 dark:bg-white/5">
                <img src={it.image_url} alt={it.caption || 'Gallery'} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-widest opacity-70">BlackBox</div>
                <div className="mt-1 text-sm bb-muted">{it.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
