import type { GrammaticalCategory } from '../../types/saac'
import { CATEGORY_COLORS } from '../../types/saac'

interface CategoryBadgeProps {
  category: GrammaticalCategory
}

const CATEGORY_LABELS: Record<GrammaticalCategory, string> = {
  sustantivo: 'Sustantivo',
  verbo: 'Verbo',
  adjetivo: 'Adjetivo',
  pronombre: 'Pronombre',
  comunicacion_rapida: 'Com. Rápida',
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
