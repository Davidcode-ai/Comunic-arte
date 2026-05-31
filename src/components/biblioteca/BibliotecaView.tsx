import { useCallback, useState } from 'react'
import type { Pictogram } from '../../types/saac'
import { PictogramGrid } from './PictogramGrid'
import { PhraseBar } from './PhraseBar'
import { useSpeech } from '../../hooks/useSpeech'

export function BibliotecaView() {
  const [phrase, setPhrase] = useState<Pictogram[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const { speakText, isSpeaking, supported } = useSpeech()

  const addToPhrase = useCallback((pictogram: Pictogram) => {
    setPhrase((prev) => [...prev, pictogram])
  }, [])

  const removeFromPhrase = (index: number) => {
    setPhrase((prev) => prev.filter((_, i) => i !== index))
  }

  const clearPhrase = () => setPhrase([])

  const handleSpeak = () => {
    if (!supported) {
      setStatusMessage('Tu navegador no soporta síntesis de voz')
      return
    }
    if (phrase.length === 0) return
    const text = phrase.map((p) => p.word).join(' ')
    speakText(text)
    setStatusMessage(`Reproduciendo: ${text}`)
    setTimeout(() => setStatusMessage(''), 3000)
  }

  return (
    <div className="flex h-full flex-col pb-52">
      {!supported && (
        <p className="mx-4 mt-4 rounded-lg bg-amber-50 px-4 py-2 text-amber-800" role="alert">
          La síntesis de voz no está disponible en este navegador.
        </p>
      )}

      <div aria-live="polite" className="sr-only">
        {statusMessage}
      </div>
      {statusMessage && (
        <p
          className="mx-4 mt-2 rounded-lg bg-blue-50 px-4 py-2 text-center font-medium text-blue-800"
          role="status"
        >
          {statusMessage}
        </p>
      )}

      <PictogramGrid onAdd={addToPhrase} />

      <PhraseBar
        phrase={phrase}
        onRemove={removeFromPhrase}
        onClear={clearPhrase}
        onSpeak={handleSpeak}
        onDrop={addToPhrase}
        isSpeaking={isSpeaking}
      />
    </div>
  )
}
