import type { CustomSymbol } from '../../types/saac'
import { CategoryBadge } from '../ui/CategoryBadge'

interface SymbolGalleryProps {
  symbols: CustomSymbol[]
  selectedId: string | null
  onSelect: (symbol: CustomSymbol) => void
}

export function SymbolGallery({
  symbols,
  selectedId,
  onSelect,
}: SymbolGalleryProps) {
  if (symbols.length === 0) {
    return (
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <h2 className="mb-2 text-lg font-bold text-slate-900">
          Mis símbolos
        </h2>
        <p className="text-slate-500">
          Aún no tienes símbolos guardados. Dibuja uno y pulsa Guardar.
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4">
      <h2 className="mb-3 text-lg font-bold text-slate-900">Mis símbolos</h2>
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        role="list"
        aria-label="Galería de símbolos personalizados"
      >
        {symbols.map((symbol) => {
          const isSelected = selectedId === symbol.id
          return (
            <button
              key={symbol.id}
              type="button"
              role="listitem"
              onClick={() => onSelect(symbol)}
              aria-label={`Símbolo: ${symbol.word}`}
              aria-pressed={isSelected}
              className={[
                'flex min-w-[100px] shrink-0 flex-col items-center rounded-xl border-2 p-2 transition-transform active:scale-95',
                isSelected
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300',
              ].join(' ')}
            >
              <img
                src={symbol.imageData}
                alt=""
                className="mb-1 h-16 w-16 rounded-lg border border-slate-200 bg-white object-contain"
              />
              <span className="text-sm font-semibold capitalize text-slate-900">
                {symbol.word}
              </span>
              <CategoryBadge category={symbol.category} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
