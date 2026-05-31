import { LayoutGrid, PenLine } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { setOnboardingComplete as persistOnboarding } from '../../utils/storage'
import { useApp } from '../../context/AppContext'

interface WelcomeModalProps {
  isOpen: boolean
  onStart: () => void
}

export function WelcomeModal({ isOpen, onStart }: WelcomeModalProps) {
  const { setOnboardingComplete } = useApp()

  const handleStart = () => {
    persistOnboarding()
    setOnboardingComplete(true)
    onStart()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleStart}
      title="¡Bienvenido/a!"
      showClose={false}
    >
      <p className="mb-6 text-slate-600">
        Comunic-arte te ayuda a comunicarte de dos formas sencillas:
      </p>

      <div className="mb-6 space-y-4">
        <div className="flex items-start gap-4 rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
          <PenLine
            className="mt-1 shrink-0 text-blue-600"
            size={28}
            aria-hidden="true"
          />
          <div>
            <h3 className="font-bold text-slate-900">Pizarra Inteligente</h3>
            <p className="text-slate-600">
              Dibuja tus propios símbolos y dales un significado para
              comunicarte.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border-2 border-green-200 bg-green-50 p-4">
          <LayoutGrid
            className="mt-1 shrink-0 text-green-600"
            size={28}
            aria-hidden="true"
          />
          <div>
            <h3 className="font-bold text-slate-900">Biblioteca de Pictogramas</h3>
            <p className="text-slate-600">
              Construye frases arrastrando o tocando pictogramas.
            </p>
          </div>
        </div>
      </div>

      <Button fullWidth onClick={handleStart} aria-label="Empezar a usar Comunic-arte">
        Empezar
      </Button>
    </Modal>
  )
}
