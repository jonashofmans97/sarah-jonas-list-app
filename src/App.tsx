import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { WhoAreYou } from './components/WhoAreYou'
import { getDefaultList, getMe, markStartupHandled, startupHandled } from './lib/device'
import { isConfigured } from './lib/supabase'
import ListDetail from './pages/ListDetail'
import Overview from './pages/Overview'

function Home() {
  // On a fresh app launch, jump straight to the default list (once).
  const def = getDefaultList()
  if (def && !startupHandled()) {
    markStartupHandled()
    return <Navigate to={`/list/${def}`} replace />
  }
  markStartupHandled()
  return <Overview />
}

export default function App() {
  const [me, setMe] = useState(getMe())

  if (!isConfigured) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-2 text-xl font-semibold">Supabase not configured</h1>
        <p className="text-muted">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README).</p>
      </div>
    )
  }
  if (!me) return <WhoAreYou onDone={() => setMe(getMe())} />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list/:id" element={<ListDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
