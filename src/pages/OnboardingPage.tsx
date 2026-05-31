import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginScreen } from '../components/onboarding/LoginScreen'
import { WelcomeModal } from '../components/onboarding/WelcomeModal'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(false)

  const handleLogin = () => setShowWelcome(true)

  const handleStart = () => navigate('/app/pizarra')

  return (
    <div className="min-h-full bg-slate-50">
      <LoginScreen onLogin={handleLogin} />
      <WelcomeModal isOpen={showWelcome} onStart={handleStart} />
    </div>
  )
}
