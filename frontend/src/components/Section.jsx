import React from 'react'

export default function Section({ eyebrow, title, children, right }) {
  return (
    <section className="py-14">
      <div className="bb-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {eyebrow && <div className="bb-label text-cherry">{eyebrow}</div>}
            {title && <h2 className="bb-h2 mt-2">{title}</h2>}
          </div>
          {right && <div className="md:text-right">{right}</div>}
        </div>
        <div className="bb-divider my-8" />
        {children}
      </div>
    </section>
  )
}
