import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import RatingStars from '../components/RatingStars'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [gallery, setGallery] = useState([])
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const [g, r] = await Promise.all([
          api.listGallery(),
          api.listReviews(true)
        ])
        const shuffled = [...g].sort(() => Math.random() - 0.5)
        setGallery(shuffled.slice(0, 3))
        setReviews(r.slice(0, 3))
      } catch (e) {
        setError(e.message || 'Failed to load homepage content.')
      }
    })()
  }, [])

  return (
    <>
      <section className="pt-16 pb-10">
        <div className="bb-container">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="bb-label text-cherry">Luxury custom desserts</div>
              <h1 className="bb-h1 mt-3">
                Crafted to order. <span className="text-cherry">Designed</span> to impress.
              </h1>

              <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-2xl">
                BlackBox Confections is a premium custom cake and dessert studio creating
                elevated pieces for birthdays, weddings, showers, private events, and
                unforgettable moments.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/order" className="bb-btn bb-btn-accent">
                  Start Your Custom Order
                </Link>

                <Link to="/gallery" className="bb-btn">
                  View Gallery
                </Link>
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="bb-card p-6">
                <div className="bb-label">Signature experience</div>
                <div className="font-display text-2xl mt-2 leading-tight">
                  Custom cakes, cupcakes, and dessert tables
                </div>
                <p className="text-sm bb-muted mt-3 leading-relaxed">
                  Every order is made to your event, aesthetic, and flavor preferences.
                  No generic catalog. No ordinary designs.
                </p>
                <div className="bb-divider my-5" />
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest opacity-70">
                    Made to order
                  </div>
                  <div className="text-xs uppercase tracking-widest text-cherry">
                    Premium
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="mt-8 text-sm text-cherry">{error}</div>}
        </div>
      </section>

      <Section
        eyebrow="Portfolio"
        title="A glimpse of what we create."
        right={
          <Link className="bb-btn" to="/gallery">
            See full gallery
          </Link>
        }
      >
        <div className="grid md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <Link
              key={item.id}
              to={`/gallery#cake-${item.id}`}
              className="bb-card overflow-hidden block transition-transform duration-200 hover:scale-[1.01]"
            >
              <div className="aspect-[4/3] bg-black/5 dark:bg-white/5">
                <img
                  src={
                    item.image_url?.startsWith('http') || item.image_url?.startsWith('data:')
                      ? item.image_url
                      : `${import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:8000'}${item.image_url}`
                  }
                  alt={item.caption || 'Gallery item'}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="text-xs uppercase tracking-widest opacity-70">
                  BlackBox Confections
                </div>
                <div className="mt-2 text-sm bb-muted leading-relaxed">
                  {item.caption || 'Custom dessert creation'}
                </div>
              </div>
            </Link>
          ))}

          {!gallery.length && (
            <div className="bb-card p-6 bb-muted md:col-span-3">
              Gallery items will appear here once added in Admin.
            </div>
          )}
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="From inspiration to celebration."
        right={
          <Link className="bb-btn bb-btn-accent" to="/order">
            Request a custom order
          </Link>
        }
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bb-card p-6">
            <div className="bb-label">01</div>
            <div className="font-display text-xl mt-2">Browse the gallery</div>
            <p className="text-sm bb-muted mt-3 leading-relaxed">
              Explore past creations for inspiration, style direction, and event ideas.
            </p>
          </div>

          <div className="bb-card p-6">
            <div className="bb-label">02</div>
            <div className="font-display text-xl mt-2">Submit your request</div>
            <p className="text-sm bb-muted mt-3 leading-relaxed">
              Tell us about your event, dessert type, flavors, and design vision.
            </p>
          </div>

          <div className="bb-card p-6">
            <div className="bb-label">03</div>
            <div className="font-display text-xl mt-2">We bring it to life</div>
            <p className="text-sm bb-muted mt-3 leading-relaxed">
              Your order is custom made with a premium finish tailored to your occasion.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Testimonials"
        title="Loved by clients."
        right={
          <Link className="bb-btn" to="/contact">
            Get in touch
          </Link>
        }
      >
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bb-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="font-display text-lg">{r.name}</div>
                <RatingStars rating={r.rating} />
              </div>

              <p className="mt-3 text-sm bb-muted leading-relaxed">{r.message}</p>

              <div className="mt-5 text-xs uppercase tracking-widest opacity-60">
                Verified customer
              </div>
            </div>
          ))}

          {!reviews.length && (
            <div className="bb-card p-6 bb-muted md:col-span-3">
              Customer reviews will appear here once added in Admin.
            </div>
          )}
        </div>
      </Section>

      <Section eyebrow="Custom Orders" title="Ready to create something unforgettable?">
        <div className="bb-card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-display text-2xl md:text-3xl">
              Let’s design your next centerpiece.
            </div>
            <p className="text-sm md:text-base bb-muted mt-3 max-w-2xl leading-relaxed">
              From elegant tiered cakes to curated dessert tables, BlackBox Confections
              creates luxury sweets tailored to your event.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/order" className="bb-btn bb-btn-accent">
              Start Order
            </Link>
            <Link to="/gallery" className="bb-btn">
              View Work
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}