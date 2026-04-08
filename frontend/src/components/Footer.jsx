import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 mt-20">
      <div className="bb-container py-10 grid md:grid-cols-3 gap-10">
        <div>
          <div className="font-display text-xl">BlackBox Confections</div>
          <p className="bb-muted mt-3 text-sm leading-relaxed">
            Premium cakes and baked goods crafted with restraint, precision, and a signature cherry-red finish.
          </p>
        </div>
        <div>
          <div className="bb-label">Navigation</div>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/products" className="hover:text-cherry">Order</Link>
            <Link to="/gallery" className="hover:text-cherry">Gallery</Link>
            <Link to="/contact" className="hover:text-cherry">Contact</Link>
            <Link to="/admin" className="hover:text-cherry">Admin</Link>
          </div>
        </div>
        <div>
          <div className="bb-label">Hours</div>
          <div className="mt-3 text-sm bb-muted">
            <div>Mon–Fri: 10am–6pm</div>
            <div>Sat: 11am–4pm</div>
            <div>Sun: Closed</div>
          </div>
          <div className="mt-6 text-xs uppercase tracking-widest opacity-60">
            © 2020 BlackBox Confections
          </div>
        </div>
      </div>
    </footer>
  )
}
