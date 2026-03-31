import React, { useState, useRef, useEffect } from 'react'
import './IntroPage.css'

const INTRO_SCRIPT = `Welcome to the virtual mechanical engineering laboratory. In this session you will explore the dynamics of springs in series. You will learn how to: arrange multiple springs end-to-end in a chain; calculate the effective stiffness of series arrangements; and observe how mass affects extension across the springs. Use the control panel to adjust parameters, and you can ask the AI robot assistant for guidance at any time.`

const IntroPage = ({ onStart }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [useRecorded, setUseRecorded] = useState(null) // null = not tried, true/false after first attempt
  const audioRef = useRef(null)

  const pickFemaleVoice = () => {
    const voices = window.speechSynthesis.getVoices()
    const preferred = ['Samantha', 'Karen', 'Victoria', 'Google UK English Female', 'Microsoft Zira - English (United States)', 'Fiona', 'Moira']
    for (const name of preferred) {
      const v = voices.find(voice => voice.name.includes(name) || voice.name === name)
      if (v) return v
    }
    const female = voices.find(v => v.name.toLowerCase().includes('female') || v.lang.startsWith('en'))
    return female || voices[0]
  }

  const speakWithTTS = () => {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(INTRO_SCRIPT)
    utterance.rate = 0.92
    utterance.pitch = 1.0
    const voice = pickFemaleVoice()
    if (voice) utterance.voice = voice
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsSpeaking(false)
      return
    }

    const audio = audioRef.current
    if (audio) {
      audio.volume = 1
      audio.play().then(() => {
        setIsSpeaking(true)
      }).catch(() => {
        setUseRecorded(false)
        speakWithTTS()
      })
      return
    }

    setUseRecorded(false)
    speakWithTTS()
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => setIsSpeaking(false)
    const onError = () => {
      setUseRecorded(false)
      if (!isSpeaking) speakWithTTS()
    }
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    if (window.speechSynthesis) {
      const load = () => window.speechSynthesis.getVoices().length && window.speechSynthesis.getVoices()
      load()
      window.speechSynthesis.onvoiceschanged = load
    }
  }, [])

  return (
    <div className="intro-container">
      {/* Optional: pre-recorded human voice. Add public/intro-voice.mp3 for a fine female human voice. */}
      <audio
        ref={audioRef}
        src="/intro-voice.mp3"
        preload="metadata"
        onCanPlayThrough={() => setUseRecorded(true)}
        onError={() => setUseRecorded(false)}
        style={{ display: 'none' }}
      />
      <div className="intro-box">
        <h1>Introduction</h1>
        <div className="intro-text">
          <p>Welcome to the virtual mechanical engineering laboratory. In this session you will explore the dynamics of <strong>Springs in Series</strong>.</p>
          <p>You will learn how to:</p>
          <ul>
            <li>Arrange multiple springs end-to-end in a chain.</li>
            <li>Calculate the effective stiffness (k) of series arrangements.</li>
            <li>Observe how mass affects extension across the springs.</li>
          </ul>
          <p>Use the control panel to adjust parameters and ask the AI robot assistant for guidance whenever you need it.</p>
        </div>
        <div className="intro-buttons">
          <button
            type="button"
            className={`listen-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleListen}
          >
            {isSpeaking ? '⏹ Stop' : '🔊 Listen to intro'}
          </button>
          <button
            type="button"
            className="start-btn"
            onClick={() => {
              window.speechSynthesis?.cancel()
              if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }
              onStart()
            }}
          >
            Proceed to simulation
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntroPage
