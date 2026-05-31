import { forwardRef, useImperativeHandle } from 'react'
import { Eraser, Save, ScanSearch, Volume2 } from 'lucide-react'
import { useCanvas } from '../../hooks/useCanvas'
import { Button } from '../ui/Button'

export interface DrawingCanvasHandle {
  toDataURL: () => string
  isEmpty: () => boolean
  clear: () => void
}

interface DrawingCanvasProps {
  onSave: () => void
  onSpeak: () => void
  onRecognize: () => void
  isRecognizing?: boolean
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  function DrawingCanvas({ onSave, onSpeak, onRecognize, isRecognizing = false }, ref) {
    const {
      canvasRef,
      containerRef,
      startDrawing,
      draw,
      stopDrawing,
      clear,
      toDataURL,
      isEmpty,
      isCanvasEmpty,
    } = useCanvas()

    useImperativeHandle(ref, () => ({
      toDataURL,
      isEmpty: isCanvasEmpty,
      clear,
    }))

    return (
      <div className="flex flex-col gap-4 p-4">
        <div
          ref={containerRef}
          className="h-[50vh] min-h-[240px] w-full overflow-hidden rounded-2xl border-4 border-slate-300 bg-white shadow-inner"
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full touch-none cursor-crosshair"
            aria-label="Lienzo de dibujo. Dibuja tu símbolo personalizado."
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button
            variant="secondary"
            onClick={clear}
            aria-label="Limpiar lienzo"
          >
            <Eraser size={22} aria-hidden="true" />
            Limpiar
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={isEmpty}
            aria-label="Guardar símbolo dibujado"
          >
            <Save size={22} aria-hidden="true" />
            Guardar
          </Button>
          <Button
            variant="secondary"
            onClick={onRecognize}
            disabled={isEmpty || isRecognizing}
            aria-label="Reconocer símbolo dibujado"
          >
            <ScanSearch size={22} aria-hidden="true" />
            {isRecognizing ? 'Analizando...' : 'Reconocer'}
          </Button>
          <Button
            variant="primary"
            onClick={onSpeak}
            aria-label="Reproducir palabra del símbolo seleccionado"
          >
            <Volume2 size={22} aria-hidden="true" />
            Hablar
          </Button>
        </div>
      </div>
    )
  },
)
