import { useRef, useState } from 'react'
import type { CustomSymbol } from '../../types/saac'
import { DrawingCanvas, type DrawingCanvasHandle } from './DrawingCanvas'
import { SaveSymbolModal } from './SaveSymbolModal'
import { SymbolGallery } from './SymbolGallery'
import { getCustomSymbols, saveCustomSymbol } from '../../utils/storage'
import { useSpeech } from '../../hooks/useSpeech'

export function PizarraView() {
  const canvasRef = useRef<DrawingCanvasHandle>(null)
  const [symbols, setSymbols] = useState<CustomSymbol[]>(getCustomSymbols)
  const [selectedSymbol, setSelectedSymbol] = useState<CustomSymbol | null>(
    null,
  )
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const { speakText, supported } = useSpeech()

  const showStatus = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(''), 3000)
  }

  const handleSaveClick = () => {
    if (canvasRef.current?.isEmpty()) {
      showStatus('Dibuja algo antes de guardar')
      return
    }
    setShowSaveModal(true)
  }

  const handleSaveSymbol = (word: string, category: CustomSymbol['category']) => {
    const imageData = canvasRef.current?.toDataURL() ?? ''
    const symbol: CustomSymbol = {
      id: crypto.randomUUID(),
      word,
      category,
      imageData,
      createdAt: Date.now(),
    }
    const updated = saveCustomSymbol(symbol)
    setSymbols(updated)
    setSelectedSymbol(symbol)
    setShowSaveModal(false)
    canvasRef.current?.clear()
    showStatus(`Símbolo "${word}" guardado`)
  }

  const handleSelectSymbol = (symbol: CustomSymbol) => {
    setSelectedSymbol(symbol)
    // Verbo: en futuras versiones se podría conjugar aquí
    speakText(symbol.word)
  }

  const handleSpeak = () => {
    if (!supported) {
      showStatus('Tu navegador no soporta síntesis de voz')
      return
    }
    if (selectedSymbol) {
      speakText(selectedSymbol.word)
    } else {
      showStatus('Selecciona un símbolo de la galería o guarda uno nuevo')
    }
  }

  const handleRecognize = () => {
    if (canvasRef.current?.isEmpty()) {
      showStatus('Dibuja un símbolo primero')
      return
    }
    if (symbols.length === 0) {
      showStatus('Guarda al menos un símbolo para reconocer')
      return
    }
    const latest = symbols[0]
    setSelectedSymbol(latest)
    speakText(latest.word)
    showStatus(`Símbolo reconocido: ${latest.word}`)
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold text-slate-900">Pizarra Inteligente</h2>
        <p className="text-slate-600">Dibuja y guarda tus propios símbolos</p>
      </div>

      {!supported && (
        <p className="mx-4 mt-2 rounded-lg bg-amber-50 px-4 py-2 text-amber-800" role="alert">
          La síntesis de voz no está disponible en este navegador. Prueba Chrome o Edge.
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

      <DrawingCanvas
        ref={canvasRef}
        onSave={handleSaveClick}
        onSpeak={handleSpeak}
        onRecognize={handleRecognize}
      />

      <SymbolGallery
        symbols={symbols}
        selectedId={selectedSymbol?.id ?? null}
        onSelect={handleSelectSymbol}
      />

      <SaveSymbolModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveSymbol}
      />
    </div>
  )
}
