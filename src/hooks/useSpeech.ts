import { useCallback, useEffect, useRef, useState } from 'react'

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function pickSpanishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => v.lang === 'es-ES' && v.localService) ??
    voices.find((v) => v.lang === 'es-ES') ??
    voices.find((v) => v.lang.startsWith('es-')) ??
    voices.find((v) => v.lang.startsWith('es')) ??
    voices[0]
  )
}

/** Precarga voces (en móvil la lista llega vacía hasta voiceschanged). */
function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  return window.speechSynthesis.getVoices()
}

let cachedVoices: SpeechSynthesisVoice[] = []

function ensureVoicesLoaded(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  const voices = loadVoices()
  if (voices.length > 0) {
    cachedVoices = voices
  }
  return cachedVoices
}

/** Desbloquea TTS en Android tras el primer gesto del usuario. */
export function unlockSpeechOnGesture(): void {
  if (!isSpeechSupported()) return

  const unlock = () => {
    window.speechSynthesis.resume()
    ensureVoicesLoaded()

    // “Calentamiento” silencioso requerido por Chrome Android
    const warmup = new SpeechSynthesisUtterance('\u200B')
    warmup.volume = 0
    warmup.rate = 1
    window.speechSynthesis.speak(warmup)

    document.removeEventListener('touchstart', unlock)
    document.removeEventListener('click', unlock)
  }

  document.addEventListener('touchstart', unlock, { once: true, passive: true })
  document.addEventListener('click', unlock, { once: true })
}

function doSpeak(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (message: string) => void,
): void {
  if (!isSpeechSupported() || !text.trim()) return

  const trimmed = text.trim()
  const voices = ensureVoicesLoaded()
  const voice = pickSpanishVoice(voices)

  const utterance = new SpeechSynthesisUtterance(trimmed)
  utterance.lang = voice?.lang ?? 'es-ES'
  utterance.rate = 0.9
  utterance.volume = 1
  if (voice) utterance.voice = voice

  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = (e) => {
    onEnd?.()
    if (e.error !== 'interrupted') {
      onError?.(`Error de voz: ${e.error}`)
    }
  }

  // Chrome Android: resume + pequeño delay tras cancel evita que speak() falle en silencio
  window.speechSynthesis.resume()
  window.speechSynthesis.cancel()
  window.speechSynthesis.resume()

  const speakNow = () => {
    window.speechSynthesis.resume()
    window.speechSynthesis.speak(utterance)
  }

  if (isMobileDevice()) {
    window.setTimeout(speakNow, 100)
  } else {
    speakNow()
  }
}

export function speak(text: string, lang = 'es-ES'): void {
  if (!isSpeechSupported() || !text.trim()) return
  doSpeak(text)
  void lang
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const supported = isSpeechSupported()
  const initRef = useRef(false)

  useEffect(() => {
    if (!supported || initRef.current) return
    initRef.current = true

    ensureVoicesLoaded()
    unlockSpeechOnGesture()

    const onVoicesChanged = () => {
      cachedVoices = loadVoices()
    }

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
    }
  }, [supported])

  const speakText = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return

      setLastError(null)
      doSpeak(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        (msg) => setLastError(msg),
      )
    },
    [supported],
  )

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speakText, stop, isSpeaking, supported, lastError }
}
