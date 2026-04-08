import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Order from './pages/Order'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { api } from './lib/api'

export default function App() {
  const location = useLocation()

  // track page visits (skip admin)
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      api.trackVisit(location.pathname)
      // Also send to Google Analytics if loaded
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: location.pathname,
          page_title: document.title
        })
      }
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 page-enter" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/order" element={<Order />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
    </div>
  )
}
