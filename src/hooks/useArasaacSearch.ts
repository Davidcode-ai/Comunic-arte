import { useEffect, useState } from 'react'
import type { Pictogram } from '../types/saac'
import {
  getKeywordFromResult,
  getArasaacImageUrl,
  searchArasaacPictograms,
} from '../utils/arasaac'

export function useArasaacSearch(query: string, debounceMs = 400) {
  const [results, setResults] = useState<Pictogram[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const timer = window.setTimeout(async () => {
      try {
        const data = await searchArasaacPictograms(trimmed)
        const mapped: Pictogram[] = data.slice(0, 24).map((item) => ({
          id: String(item._id),
          arasaacId: item._id,
          word: getKeywordFromResult(item, trimmed),
          imageUrl: getArasaacImageUrl(item._id),
        }))
        setResults(mapped)
      } catch {
        setError('Error al buscar pictogramas. Comprueba tu conexión.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => window.clearTimeout(timer)
  }, [query, debounceMs])

  return { results, isLoading, error }
}
