import { useCallback, useState } from 'react'

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, lang = 'es-ES'): void {
  if (!isSpeechSupported() || !text.trim()) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.trim())
  utterance.lang = lang
  utterance.rate = 0.9
  window.speechSynthesis.speak(utterance)
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const supported = isSpeechSupported()

  const speakText = useCallback((text: string) => {
    if (!supported || !text.trim()) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.trim())
    utterance.lang = 'es-ES'
    utterance.rate = 0.9

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [supported])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speakText, stop, isSpeaking, supported }
}
