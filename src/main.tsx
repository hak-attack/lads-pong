import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize theme from localStorage
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme') || 'light'
  document.documentElement.classList.add(theme)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
