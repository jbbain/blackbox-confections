import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './state/theme'
import { AdminAuthProvider } from './state/adminAuth'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AdminAuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
