import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { OnboardingPage } from './pages/OnboardingPage'
import { PizarraPage } from './pages/PizarraPage'
import { BibliotecaPage } from './pages/BibliotecaPage'
import type { AppTab } from './types/saac'

function RootRedirect() {
  const { onboardingComplete } = useApp()
  return (
    <Navigate
      to={onboardingComplete ? '/app/pizarra' : '/onboarding'}
      replace
    />
  )
}

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userName } = useApp()

  const activeTab: AppTab = location.pathname.includes('biblioteca')
    ? 'biblioteca'
    : 'pizarra'

  const handleTabChange = (tab: AppTab) => {
    navigate(tab === 'pizarra' ? '/app/pizarra' : '/app/biblioteca')
  }

  return (
    <AppShell
      userName={userName}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <Routes>
        <Route path="pizarra" element={<PizarraPage />} />
        <Route path="biblioteca" element={<BibliotecaPage />} />
        <Route path="*" element={<Navigate to="/app/pizarra" replace />} />
      </Routes>
    </AppShell>
  )
}

function AppRoutes() {
  const { onboardingComplete } = useApp()

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/onboarding"
        element={
          onboardingComplete ? (
            <Navigate to="/app/pizarra" replace />
          ) : (
            <OnboardingPage />
          )
        }
      />
      <Route
        path="/app/*"
        element={
          onboardingComplete ? (
            <AppLayout />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
