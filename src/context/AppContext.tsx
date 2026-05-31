import { createContext, useContext, useState, type ReactNode } from 'react'
import { getUserName, isOnboardingComplete } from '../utils/storage'

interface AppContextValue {
  userName: string
  setUserName: (name: string) => void
  onboardingComplete: boolean
  setOnboardingComplete: (value: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState(getUserName)
  const [onboardingComplete, setOnboardingCompleteState] = useState(
    isOnboardingComplete,
  )

  const setUserName = (name: string) => setUserNameState(name)
  const setOnboardingComplete = (value: boolean) =>
    setOnboardingCompleteState(value)

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        onboardingComplete,
        setOnboardingComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
