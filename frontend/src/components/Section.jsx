import React from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Section({ eyebrow, title, children, right }) {
  const [headerRef, headerVisible] = useScrollReveal()
  const [bodyRef, bodyVisible] = useScrollReveal()

  return (
    <section className="py-14">
      <div className="bb-container">
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 reveal fade-up ${headerVisible ? 'visible' : ''}`}
        >
          <div>
            {eyebrow && <div className="bb-label text-cherry">{eyebrow}</div>}
            {title && <h2 className="bb-h2 mt-2">{title}</h2>}
          </div>
          {right && <div className="md:text-right">{right}</div>}
        </div>
        <div className={`bb-divider my-8 bb-divider-animated ${headerVisible ? 'visible' : ''}`} />
        <div
          ref={bodyRef}
          className={`reveal fade-up ${bodyVisible ? 'visible' : ''}`}
          style={{ animationDelay: '0.1s' }}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
