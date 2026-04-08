import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTheme } from '../state/theme'
import logo from '../images/black-box-confections-logo.png'

const navLinkClass = ({ isActive }) =>
  `text-xs uppercase tracking-widest hover:text-cherry transition ${isActive ? 'text-cherry' : 'opacity-80'}`

const mobileNavLinkClass = ({ isActive }) =>
  `block text-sm uppercase tracking-widest py-3 border-b border-black/5 dark:border-white/5 transition ${isActive ? 'text-cherry' : 'opacity-80 hover:text-cherry'}`

export default function Navbar() {
  const { mode, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-bone/70 dark:bg-ink/70 backdrop-blur-sm">
      <div className="bb-container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 border border-black/15 dark:border-white/15 grid place-items-center">
            <img src={logo} alt="BlackBox Confections" className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-tight">BlackBox</div>
            <div className="text-[10px] uppercase tracking-[0.24em] opacity-70 -mt-1">Confections</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/gallery" className={navLinkClass}>Gallery</NavLink>
          <NavLink to="/order" className={navLinkClass}>Custom Order</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggle} className="bb-btn" title="Toggle theme">
            {mode === 'dark' ? 'Light' : 'Dark'}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden bb-btn px-2"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${mobileOpen ? 'rotate-90' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bb-container pb-6 pt-2">
          <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>About</NavLink>
          <NavLink to="/gallery" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Gallery</NavLink>
          <NavLink to="/order" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Custom Order</NavLink>
          <NavLink to="/contact" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}
