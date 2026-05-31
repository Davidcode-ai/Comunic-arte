import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { GrammaticalCategory } from '../../types/saac'
import { GRAMMATICAL_CATEGORIES } from '../../types/saac'

interface SaveSymbolModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (word: string, category: GrammaticalCategory) => void
}

export function SaveSymbolModal({
  isOpen,
  onClose,
  onSave,
}: SaveSymbolModalProps) {
  const [word, setWord] = useState('')
  const [category, setCategory] = useState<GrammaticalCategory>('sustantivo')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim()) {
      setError('Escribe un significado para el símbolo')
      return
    }
    onSave(word.trim(), category)
    setWord('')
    setCategory('sustantivo')
    setError('')
  }

  const handleClose = () => {
    setWord('')
    setCategory('sustantivo')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar símbolo"
      titleId="save-symbol-title"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="symbolWord"
            className="mb-2 block font-medium text-slate-900"
          >
            Significado
          </label>
          <input
            id="symbolWord"
            type="text"
            value={word}
            onChange={(e) => {
              setWord(e.target.value)
              setError('')
            }}
            placeholder='Ej: "Enfadado", "Yo"'
            className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
          />
          {error && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="mb-2 font-medium text-slate-900">Categoría</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {GRAMMATICAL_CATEGORIES.map(({ value, label }) => (
              <label
                key={value}
                className={[
                  'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2',
                  category === value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="category"
                  value={value}
                  checked={category === value}
                  onChange={() => setCategory(value)}
                  className="h-5 w-5 accent-blue-600"
                />
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button type="submit" fullWidth aria-label="Guardar símbolo">
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
