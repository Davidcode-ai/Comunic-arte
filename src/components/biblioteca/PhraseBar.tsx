import { Trash2, Volume2, X } from 'lucide-react'
import type { Pictogram } from '../../types/saac'
import { Button } from '../ui/Button'

interface PhraseBarProps {
  phrase: Pictogram[]
  onRemove: (index: number) => void
  onClear: () => void
  onSpeak: () => void
  onDrop: (pictogram: Pictogram) => void
  isSpeaking: boolean
}

export function PhraseBar({
  phrase,
  onRemove,
  onClear,
  onSpeak,
  onDrop,
  isSpeaking,
}: PhraseBarProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/pictogram')
    if (!raw) return
    try {
      const pictogram = JSON.parse(raw) as Pictogram
      onDrop(pictogram)
    } catch {
      // ignore invalid drop data
    }
  }

  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-30 border-t-2 border-slate-300 bg-white shadow-lg"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto max-w-lg px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Mi frase</h3>
          {phrase.length > 0 && (
            <Button
              variant="ghost"
              className="min-h-10 px-3 py-1 text-sm"
              onClick={onClear}
              aria-label="Limpiar frase"
            >
              <Trash2 size={18} aria-hidden="true" />
              Limpiar
            </Button>
          )}
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={[
            'mb-3 flex min-h-[72px] items-center gap-2 overflow-x-auto rounded-xl border-2 border-dashed p-2',
            phrase.length === 0
              ? 'border-slate-300 bg-slate-50'
              : 'border-blue-300 bg-blue-50',
          ].join(' ')}
          aria-label="Barra de construcción de frase. Arrastra pictogramas aquí."
        >
          {phrase.length === 0 ? (
            <p className="w-full text-center text-slate-400">
              Toca o arrastra pictogramas aquí
            </p>
          ) : (
            phrase.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="relative flex shrink-0 flex-col items-center rounded-xl border-2 border-slate-200 bg-white px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={`Quitar ${item.word} de la frase`}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                >
                  <X size={14} aria-hidden="true" />
                </button>
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-12 w-12 object-contain"
                />
                <span className="text-xs font-semibold capitalize">
                  {item.word}
                </span>
              </div>
            ))
          )}
        </div>

        <Button
          fullWidth
          onClick={onSpeak}
          disabled={phrase.length === 0 || isSpeaking}
          aria-label="Reproducir frase completa"
          className="text-xl"
        >
          <Volume2 size={28} aria-hidden="true" />
          {isSpeaking ? 'Hablando...' : 'Hablar'}
        </Button>
      </div>
    </div>
  )
}
