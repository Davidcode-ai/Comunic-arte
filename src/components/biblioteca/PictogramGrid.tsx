import { Search } from 'lucide-react'
import { useState } from 'react'
import type { Pictogram, PictogramCategory } from '../../types/saac'
import {
  PICTOGRAM_CATEGORY_COLORS,
  PICTOGRAM_CATEGORY_LABELS,
} from '../../types/saac'
import { PICTOGRAMS } from '../../data/pictograms'
import { useArasaacSearch } from '../../hooks/useArasaacSearch'
import { PictogramTile } from './PictogramTile'

interface PictogramGridProps {
  onAdd: (pictogram: Pictogram) => void
}

const categories: PictogramCategory[] = [
  'emociones',
  'lugares',
  'verbos',
  'tiempo',
]

export function PictogramGrid({ onAdd }: PictogramGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { results, isLoading, error } = useArasaacSearch(searchQuery)
  const isSearching = searchQuery.trim().length > 0

  return (
    <div className="space-y-4 overflow-y-auto px-4 pb-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Biblioteca de Pictogramas
        </h2>
        <p className="text-slate-600">
          Busca en ARASAAC o toca un pictograma para construir tu frase
        </p>
      </div>

      <div className="relative">
        <label htmlFor="arasaac-search" className="sr-only">
          Buscar pictogramas en ARASAAC
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={22}
          aria-hidden="true"
        />
        <input
          id="arasaac-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar palabra... (ej: comer, casa, feliz)"
          className="w-full rounded-xl border-2 border-slate-300 py-3 pl-12 pr-4 text-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {isSearching && (
        <section aria-labelledby="search-results-title">
          <h3
            id="search-results-title"
            className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500"
          >
            Resultados de búsqueda
          </h3>

          {isLoading && (
            <p className="rounded-xl bg-slate-100 px-4 py-6 text-center text-slate-600">
              Buscando pictogramas...
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-red-700" role="alert">
              {error}
            </p>
          )}

          {!isLoading && !error && results.length === 0 && (
            <p className="rounded-xl bg-slate-100 px-4 py-6 text-center text-slate-600">
              No se encontraron pictogramas para &quot;{searchQuery}&quot;
            </p>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 p-2 sm:grid-cols-4">
              {results.map((pictogram) => (
                <PictogramTile
                  key={pictogram.id}
                  pictogram={pictogram}
                  onAdd={onAdd}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {!isSearching && (
        <>
          <p className="text-sm text-slate-500">
            Pictogramas de ARASAAC · Fuente:{' '}
            <a
              href="https://arasaac.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              arasaac.org
            </a>
          </p>

          {categories.map((category) => {
            const items = PICTOGRAMS.filter((p) => p.category === category)
            return (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h3
                  id={`cat-${category}`}
                  className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500"
                >
                  {PICTOGRAM_CATEGORY_LABELS[category]}
                </h3>
                <div
                  className={`grid grid-cols-3 gap-2 rounded-xl border-2 p-2 sm:grid-cols-4 ${PICTOGRAM_CATEGORY_COLORS[category]}`}
                >
                  {items.map((pictogram) => (
                    <PictogramTile
                      key={pictogram.id}
                      pictogram={pictogram}
                      onAdd={onAdd}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
