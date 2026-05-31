import { useState } from 'react'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { setUserName as persistUserName } from '../../utils/storage'
import { useApp } from '../../context/AppContext'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { setUserName } = useApp()
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalName = name.trim() || 'Usuario'
    persistUserName(finalName)
    setUserName(finalName)
    onLogin()
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size={88} className="mb-4 justify-center" />
          <h1 className="text-2xl font-bold text-slate-900">Comunic-arte</h1>
          <p className="mt-2 text-slate-600">
            Comunicación accesible con pictogramas y símbolos propios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="mb-2 block text-lg font-medium text-slate-900"
            >
              ¿Cómo te llamas?
            </label>
            <input
              id="userName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Usuario"
              autoComplete="name"
              className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <Button type="submit" fullWidth aria-label="Entrar a Comunic-arte">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
