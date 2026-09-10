import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./registration/firebase"
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <App />
)

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
