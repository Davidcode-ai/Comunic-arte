import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { unlockSpeechOnGesture } from './hooks/useSpeech'

function SpeechUnlock() {
  useEffect(() => {
    unlockSpeechOnGesture()
  }, [])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SpeechUnlock />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
