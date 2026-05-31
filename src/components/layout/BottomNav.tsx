import { LayoutGrid, PenLine } from 'lucide-react'
import type { AppTab } from '../../types/saac'

interface BottomNavProps {
  active: AppTab
  onChange: (tab: AppTab) => void
}

const tabs: { id: AppTab; label: string; icon: typeof PenLine }[] = [
  { id: 'pizarra', label: 'Pizarra', icon: PenLine },
  { id: 'biblioteca', label: 'Biblioteca', icon: LayoutGrid },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-lg"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
      aria-label="Navegación principal"
    >
      <div className="mx-auto flex max-w-lg">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              className={[
                'flex min-h-16 flex-1 flex-col items-center justify-center gap-1 py-2',
                'text-sm font-semibold transition-colors',
                'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600',
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              <Icon size={28} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
