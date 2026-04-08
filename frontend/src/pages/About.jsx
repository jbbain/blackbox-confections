import React from 'react'
import Section from '../components/Section'
import useScrollReveal from '../hooks/useScrollReveal'

export default function About() {
  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.05 })
  const [cardsRef, cardsVisible] = useScrollReveal()

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div ref={heroRef} className={`reveal fade-up ${heroVisible ? 'visible' : ''}`}>
            <div className="bb-label text-cherry">About</div>
            <h1 className="bb-h1 mt-3">A premium bakery built on restraint.</h1>
            <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
              BlackBox Confections is a boutique cake and baked goods studio where every detail is intentional.
              We design flavors like we design presentation: minimal, luxurious, precise.
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="Philosophy" title="Craft, elevated.">
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          <div className={`bb-card p-6 reveal fade-up ${cardsVisible ? 'visible' : ''} stagger-1`}>
            <div className="bb-label">01</div>
            <div className="font-display text-xl mt-2">Signature palette</div>
            <p className="text-sm bb-muted mt-3 leading-relaxed">
              Red, black, and white—clean contrast that reads premium in every context.
            </p>
          </div>
          <div className={`bb-card p-6 reveal fade-up ${cardsVisible ? 'visible' : ''} stagger-2`}>
            <div className="bb-label">02</div>
            <div className="font-display text-xl mt-2">Ingredients first</div>
            <p className="text-sm bb-muted mt-3 leading-relaxed">
              High-quality cocoa, real vanilla, and balanced sweetness. No shortcuts.
            </p>
          </div>
          <div className={`bb-card p-6 reveal fade-up ${cardsVisible ? 'visible' : ''} stagger-3`}>
            <div className="bb-label">03</div>
            <div className="font-display text-xl mt-2">Made to order</div>
            <p className="text-sm bb-muted mt-3 leading-relaxed">
              Seasonal drops and custom requests, prepared with a tailored finish.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
