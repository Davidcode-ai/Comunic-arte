import type { Pictogram } from '../../types/saac'

interface PictogramTileProps {
  pictogram: Pictogram
  onAdd: (pictogram: Pictogram) => void
  size?: 'grid' | 'phrase'
}

export function PictogramTile({
  pictogram,
  onAdd,
  size = 'grid',
}: PictogramTileProps) {
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData('application/pictogram', JSON.stringify(pictogram))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const imgSize = size === 'grid' ? 'h-16 w-16' : 'h-12 w-12'

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onAdd(pictogram)}
      aria-label={`Añadir ${pictogram.word}`}
      className={[
        'flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-transparent bg-white shadow-sm transition-transform active:scale-95 hover:border-slate-300 focus-visible:border-blue-600',
        size === 'grid' ? 'min-h-[100px] p-2' : 'px-2 py-1',
      ].join(' ')}
    >
      <img
        src={pictogram.imageUrl}
        alt=""
        loading="lazy"
        className={`${imgSize} object-contain`}
      />
      <span
        className={[
          'font-semibold capitalize text-slate-900',
          size === 'grid' ? 'text-sm' : 'text-xs',
        ].join(' ')}
      >
        {pictogram.word}
      </span>
    </button>
  )
}
