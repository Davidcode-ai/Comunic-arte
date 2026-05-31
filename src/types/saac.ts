export type GrammaticalCategory =
  | 'sustantivo'
  | 'verbo'
  | 'adjetivo'
  | 'pronombre'
  | 'comunicacion_rapida'

export type PictogramCategory = 'emociones' | 'lugares' | 'verbos' | 'tiempo'

export type AppTab = 'pizarra' | 'biblioteca'

export interface CustomSymbol {
  id: string
  word: string
  category: GrammaticalCategory
  imageData: string
  createdAt: number
}

export interface Pictogram {
  id: string
  arasaacId: number
  word: string
  category?: PictogramCategory
  imageUrl: string
}

export const GRAMMATICAL_CATEGORIES: {
  value: GrammaticalCategory
  label: string
}[] = [
  { value: 'sustantivo', label: 'Sustantivo' },
  { value: 'verbo', label: 'Verbo' },
  { value: 'adjetivo', label: 'Adjetivo' },
  { value: 'pronombre', label: 'Pronombre' },
  { value: 'comunicacion_rapida', label: 'Comunicación Rápida' },
]

export const CATEGORY_COLORS: Record<GrammaticalCategory, string> = {
  sustantivo: 'bg-blue-100 text-blue-800',
  verbo: 'bg-green-100 text-green-800',
  adjetivo: 'bg-orange-100 text-orange-800',
  pronombre: 'bg-purple-100 text-purple-800',
  comunicacion_rapida: 'bg-red-100 text-red-800',
}

export const PICTOGRAM_CATEGORY_LABELS: Record<PictogramCategory, string> = {
  emociones: 'Emociones',
  lugares: 'Lugares',
  verbos: 'Verbos',
  tiempo: 'Tiempo / Pronombres',
}

export const PICTOGRAM_CATEGORY_COLORS: Record<PictogramCategory, string> = {
  emociones: 'bg-yellow-50 border-yellow-300',
  lugares: 'bg-sky-50 border-sky-300',
  verbos: 'bg-green-50 border-green-300',
  tiempo: 'bg-purple-50 border-purple-300',
}
