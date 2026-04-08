import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './state/theme'
import { AdminAuthProvider } from './state/adminAuth'
import { Analytics } from '@vercel/analytics/react'

// ── Google Analytics 4 ──
;(function initGA() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!id) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false }) // sent on route change in App.jsx
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AdminAuthProvider>
          <BrowserRouter>
            <App />
            <Analytics />
          </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
