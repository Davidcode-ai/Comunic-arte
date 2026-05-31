interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function Logo({ size = 40, className = '', showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.svg"
        alt="Logo de Comunic-arte"
        width={size}
        height={size}
        className="shrink-0 rounded-xl"
      />
      {showText && (
        <span className="text-xl font-bold text-slate-900">Comunic-arte</span>
      )}
    </div>
  )
}
