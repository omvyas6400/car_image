import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoadingProvider, useLoading } from './contexts/LoadingContext'
import { LuxuryLoader } from './components/common/LuxuryLoader'
import { Navbar } from './components/common/Navbar'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const SignInPage = lazy(() => import('./pages/SignInPage'))

function AppContent() {
  const { isLoading } = useLoading()

  return (
    <>
      {/* Luxury Loader - Shows on initial load only */}
      {isLoading && <LuxuryLoader />}

      {/* Main App - Hidden during initial load */}
      {!isLoading && (
        <BrowserRouter>
          <div className="min-h-screen bg-gray-950">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      )}
    </>
  )
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  )
}

export default App
