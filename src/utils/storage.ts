import type { CustomSymbol } from '../types/saac'

export const STORAGE_KEYS = {
  userName: 'comunicarte_userName',
  onboarding: 'comunicarte_onboarding',
  customSymbols: 'comunicarte_customSymbols',
} as const

const MAX_SYMBOLS = 50

export function getUserName(): string {
  return localStorage.getItem(STORAGE_KEYS.userName) ?? ''
}

export function setUserName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.userName, name)
}

export function isOnboardingComplete(): boolean {
  return localStorage.getItem(STORAGE_KEYS.onboarding) === 'true'
}

export function setOnboardingComplete(): void {
  localStorage.setItem(STORAGE_KEYS.onboarding, 'true')
}

export function getCustomSymbols(): CustomSymbol[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.customSymbols)
    if (!raw) return []
    return JSON.parse(raw) as CustomSymbol[]
  } catch {
    return []
  }
}

export function saveCustomSymbol(symbol: CustomSymbol): CustomSymbol[] {
  const symbols = getCustomSymbols()
  const updated = [symbol, ...symbols].slice(0, MAX_SYMBOLS)
  localStorage.setItem(STORAGE_KEYS.customSymbols, JSON.stringify(updated))
  return updated
}

export function deleteCustomSymbol(id: string): CustomSymbol[] {
  const updated = getCustomSymbols().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEYS.customSymbols, JSON.stringify(updated))
  return updated
}
