import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components
const RecurringSlots = React.lazy(() => import('./pages/RecurringSlots'))
const Schedule = React.lazy(() => import('./pages/Schedule'))

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Schedule />} />
              <Route path="/recurring-slots" element={<RecurringSlots />} />
              <Route path="/schedule" element={<Schedule />} />
            </Routes>
          </Suspense>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
