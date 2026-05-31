import type { ReactNode } from 'react'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import type { AppTab } from '../../types/saac'

interface AppShellProps {
  userName?: string
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
  children: ReactNode
}

export function AppShell({
  userName,
  activeTab,
  onTabChange,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Header userName={userName} />
      <main className="mx-auto w-full max-w-lg flex-1 overflow-hidden pb-20">
        {children}
      </main>
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  )
}
