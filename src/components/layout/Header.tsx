import { Logo } from '../ui/Logo'

interface HeaderProps {
  userName?: string
}

export function Header({ userName }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-sm"
      style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div>
          <Logo size={36} showText />
          <p className="mt-0.5 text-sm text-slate-500">Comunicación accesible</p>
        </div>
        {userName && (
          <span
            className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            aria-label={`Usuario: ${userName}`}
          >
            {userName}
          </span>
        )}
      </div>
    </header>
  )
}
