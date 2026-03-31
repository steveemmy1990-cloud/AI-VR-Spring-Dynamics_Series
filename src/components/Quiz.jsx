import React, { useState, useEffect, useRef } from 'react'
import { getRandomQuizSet } from '../data/quizQuestions'
import './Quiz.css'

const pickFemaleVoice = () => {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const preferred = ['Samantha', 'Karen', 'Victoria', 'Google UK English Female', 'Microsoft Zira', 'Fiona', 'Moira']
  for (const name of preferred) {
    const v = voices.find(voice => voice.name.includes(name) || voice.name === name)
    if (v) return v
  }
  return voices.find(v => v.name.toLowerCase().includes('female')) || voices[0]
}

const speak = (text, onEnd) => {
  if (!('speechSynthesis' in window) || !text) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  const u = new window.SpeechSynthesisUtterance(text)
  u.rate = 0.92
  u.pitch = 1.0
  const voice = pickFemaleVoice()
  if (voice) u.voice = voice
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.speechSynthesis.speak(u)
}

const Quiz = ({ isOpen, onClose, onQuizComplete }) => {
  const [sessionQuestions, setSessionQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speakingRef = useRef(false)
  const resultsRef = useRef([])

  const question = sessionQuestions[currentIndex]
  const isLastQuestion = currentIndex === sessionQuestions.length - 1

  useEffect(() => {
    if (window.speechSynthesis) {
      const load = () => window.speechSynthesis.getVoices().length && window.speechSynthesis.getVoices()
      load()
      window.speechSynthesis.onvoiceschanged = load
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSessionQuestions(getRandomQuizSet(10))
      setCurrentIndex(0)
    } else {
      window.speechSynthesis?.cancel()
      setSessionQuestions([])
      setCurrentIndex(0)
      setSelectedIndex(null)
      setShowFeedback(false)
      setIsSpeaking(false)
      speakingRef.current = false
      resultsRef.current = []
    }
  }, [isOpen])

  const handleSelectOption = (optionIndex) => {
    if (selectedIndex !== null || !question) return
    setSelectedIndex(optionIndex)
    setShowFeedback(true)
    const isCorrect = optionIndex === question.correctIndex
    speakingRef.current = true
    setIsSpeaking(true)
    if (isCorrect) {
      speak(question.explanationCorrect, () => {
        speakingRef.current = false
        setIsSpeaking(false)
      })
    } else {
      const wrongExplanation = question.explanationsWrong[optionIndex] ?? "That option is not correct."
      const correctOption = question.options[question.correctIndex]
      const textToSpeak = `${wrongExplanation} The correct answer is: ${correctOption}. ${question.explanationCorrect}`
      speak(textToSpeak, () => {
        speakingRef.current = false
        setIsSpeaking(false)
      })
    }
  }

  const handleNext = () => {
    window.speechSynthesis?.cancel()
    speakingRef.current = false
    setIsSpeaking(false)

    const correct = selectedIndex === question.correctIndex
    resultsRef.current.push({ correct })

    if (isLastQuestion) {
      const results = resultsRef.current
      const scoreOutOf10 = results.filter(r => r.correct).length
      if (typeof onQuizComplete === 'function') {
        onQuizComplete({ scoreOutOf10, soughtAiHelpForQuestionNumbers: [] })
      }
      onClose()
      return
    }

    setCurrentIndex(prev => prev + 1)
    setSelectedIndex(null)
    setShowFeedback(false)
  }

  const handleClose = () => {
    window.speechSynthesis?.cancel()
    onClose()
  }

  if (!isOpen) return null
  if (sessionQuestions.length === 0) return null

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <div className="quiz-box">
        <div className="quiz-header">
          <h2 id="quiz-title" className="quiz-title">Knowledge check</h2>
          <span className="quiz-progress">Question {currentIndex + 1} of {sessionQuestions.length}</span>
          <button type="button" className="quiz-close-btn" onClick={handleClose} aria-label="Close quiz">&times;</button>
        </div>

        <div className="quiz-body">
          <p className="quiz-question-text">{question.question}</p>

          <div className="quiz-options">
            {question.options.map((option, idx) => {
              const isCorrect = idx === question.correctIndex
              const isChosen = selectedIndex === idx
              let stateClass = ''
              if (showFeedback) {
                if (isChosen && isCorrect) stateClass = 'quiz-option-correct'
                else if (isChosen && !isCorrect) stateClass = 'quiz-option-incorrect'
                else if (isCorrect) stateClass = 'quiz-option-revealed-correct'
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={`quiz-option ${stateClass}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedIndex !== null}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {showFeedback && (
            <div className={`quiz-feedback ${selectedIndex === question.correctIndex ? 'quiz-feedback-correct' : 'quiz-feedback-incorrect'}`}>
              {selectedIndex === question.correctIndex ? (
                <>
                  <span className="quiz-feedback-icon" aria-hidden="true">👍</span>
                  <span className="quiz-feedback-label">Correct</span>
                </>
              ) : (
                <>
                  <span className="quiz-feedback-icon" aria-hidden="true">👎</span>
                  <span className="quiz-feedback-label">Incorrect</span>
                </>
              )}
              {isSpeaking && <span className="quiz-speaking-hint">🔊 Playing explanation…</span>}
            </div>
          )}

          {showFeedback && (
            <button type="button" className="quiz-next-btn" onClick={handleNext}>
              {isLastQuestion ? 'Finish quiz' : 'Next question'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz
