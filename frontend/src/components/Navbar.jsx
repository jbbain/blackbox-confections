import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTheme } from '../state/theme'
import logo from '../images/black-box-confections-logo.png'

const navLinkClass = ({ isActive }) =>
  `text-xs uppercase tracking-widest hover:text-cherry transition ${isActive ? 'text-cherry' : 'opacity-80'}`

export default function Navbar() {
  const { mode, toggle } = useTheme()

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
        </div>
      </div>
    </header>
  )
}
