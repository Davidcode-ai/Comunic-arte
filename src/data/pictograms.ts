import type { Pictogram } from '../types/saac'
import { getArasaacImageUrl } from '../utils/arasaac'

function pictogram(
  arasaacId: number,
  word: string,
  category: Pictogram['category'],
): Pictogram {
  return {
    id: String(arasaacId),
    arasaacId,
    word,
    category,
    imageUrl: getArasaacImageUrl(arasaacId),
  }
}

/** Pictogramas iniciales con IDs reales de ARASAAC (es) */
export const PICTOGRAMS: Pictogram[] = [
  // Emociones
  pictogram(32456, 'feliz', 'emociones'),
  pictogram(35545, 'triste', 'emociones'),
  pictogram(35539, 'enfadado', 'emociones'),
  // Lugares
  pictogram(6964, 'casa', 'lugares'),
  pictogram(32446, 'colegio', 'lugares'),
  pictogram(2859, 'parque', 'lugares'),
  // Verbos
  pictogram(6456, 'comer', 'verbos'),
  pictogram(6061, 'beber', 'verbos'),
  pictogram(23392, 'jugar', 'verbos'),
  pictogram(6479, 'dormir', 'verbos'),
  // Tiempo / Pronombres
  pictogram(6632, 'yo', 'tiempo'),
  pictogram(12281, 'tú', 'tiempo'),
  pictogram(38277, 'mañana', 'tiempo'),
  pictogram(26997, 'noche', 'tiempo'),
  pictogram(2635, 'nueve', 'tiempo'),
  // Extras frecuentes
  pictogram(32464, 'agua', 'verbos'),
  pictogram(2494, 'pan', 'verbos'),
  pictogram(31148, 'madre', 'emociones'),
  pictogram(2497, 'padre', 'emociones'),
  pictogram(5584, 'sí', 'tiempo'),
]
