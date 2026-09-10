import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import {
  useEffect,
  useState
} from "react"

import {
  onAuthStateChanged
} from "firebase/auth"

import { auth } from "./registration/firebase"

import Register from "./registration/Register"
import Dashboard from "./dashboard/Dashboard"
import NotFound from "./NotFound"
import { API_URL } from "./config"
import { Analytics } from '@vercel/analytics/react'

import './App.css'

function App() {

  const [user, setUser] = useState(undefined)

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      if (currentUser) {
        const hasKeys = localStorage.getItem("public_key") && localStorage.getItem("private_key")
        if (!hasKeys) {
          try {
            const response = await fetch(`${API_URL}/find-user/${currentUser.email}`)
            const data = await response.json()
            if (data && data.email) {
              if (!window.isEmailAlertShown) {
                window.isEmailAlertShown = true
                const lang = localStorage.getItem('app_language') || 'tg'
                const alerts = {
                  tg: "Ин почтаи электронӣ аллакай аз ҷониби корбари дигар сабт шудааст!",
                  ru: "Этот email уже зарегистрирован другим пользователем!",
                  en: "This email is already registered by another user!",
                  fa: "این ایمیل قبلاً توسط کاربر دیگری ثبت شده است!"
                }
                alert(alerts[lang] || alerts.tg)
                setTimeout(() => {
                  window.isEmailAlertShown = false
                }, 2000)
              }
              await auth.signOut()
              setUser(null)
              return
            }
          } catch (err) {
            console.error("Error checking user registration:", err)
          }
        }
      }

      setUser(currentUser)

    })

    return () => unsubscribe()

  }, [])

  // Loading state
  if (user === undefined) {
    return (
      <div className="loading">

        <img src="/logo.png" alt="logo" />

      </div>
    )
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/register" replace />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Register />
          }
        />

        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard />
              : <Navigate to="/register" replace />
          }
        />

        <Route
          path="/messages/:email_name"
          element={
            user
              ? <Dashboard />
              : <Navigate to="/register" replace />
          }
        />

        <Route path="*" element={<NotFound />} />

      </Routes>

      <Analytics />

    </BrowserRouter>
  )
}

export default App