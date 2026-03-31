import React, { useState, useRef, useEffect } from 'react'
import { useAI } from '../context/AIContext'
import { usePlank } from '../context/PlankContext'
import { useLevel } from '../context/LevelContext'
import { useData } from '../context/DataContext'
import { getRuleBasedResponse, getSystemPrompt } from '../utils/aiKnowledgeBase'
import './AIChatInterface.css'

const AIChatInterface = () => {
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  const { 
    isRobotActive, 
    isVoiceMode, 
    setIsVoiceMode, 
    robotMessage, 
    setRobotMessage,
    conversationHistory,
    addToConversation,
    clearConversation,
    getSimulationContext,
    userActions
  } = useAI()
  const { logEvent } = useData()
  
  const { 
    plankPosition, 
    isPlankInCenter, 
    attachedSprings, 
    isMassAttached, 
    isMass1Attached, 
    springStiffness, 
    massWeight, 
    massWeight1 
  } = usePlank()
  const { level, level1Complete, hasFinishedLevel1 } = useLevel()

  // Clear chat when switching to Level 2 so AI gets correct level context (no stale Level 1 messages)
  useEffect(() => {
    if (level === 2) clearConversation()
  }, [level, clearConversation])

  const [userInput, setUserInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)
  const inputRef = useRef(null)
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        console.log('Speech recognized:', transcript)
        setUserInput(transcript)
        setIsListening(false)
        
        // Auto-send when voice input is received - call directly with transcript
        setTimeout(() => {
          processMessage(transcript)
        }, 100)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
    }
  }, [])
  
  // Start voice recognition
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        console.log('Starting speech recognition...')
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        alert('Speech recognition error: ' + error.message + '. Please make sure you\'re using Chrome or Edge and have granted microphone permissions.')
      }
    }
  }
  
  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }
  
  // Text-to-speech
  const speakMessage = (text) => {
    if (synthesisRef.current && isVoiceMode) {
      console.log('Speaking:', text)
      // Cancel any ongoing speech
      synthesisRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'
      
      utterance.onstart = () => {
        console.log('Speech started')
        setIsSpeaking(true)
      }
      utterance.onend = () => {
        console.log('Speech ended')
        setIsSpeaking(false)
      }
      utterance.onerror = (event) => {
        console.error('Speech error:', event)
        setIsSpeaking(false)
      }
      
      // Small delay to ensure previous speech is cancelled
      setTimeout(() => {
        synthesisRef.current.speak(utterance)
      }, 100)
    }
  }
  
  // Get AI response
  const getAIResponse = async (userMessage) => {
    // Get current simulation state
    const simulationState = {
      plankInCenter: isPlankInCenter,
      attachedSprings,
      massAttached: isMassAttached,
      mass1Attached: isMass1Attached,
      springStiffness,
      massWeight,
      massWeight1,
      level,
      level1Complete,
      hasFinishedLevel1,
      recentActions: userActions.slice(-10)
    }
    
    // Try Netlify backend (OpenAI proxy) first to avoid CORS; then fall back to rule-based
    try {
      const systemPrompt = getSystemPrompt(simulationState)
      const messages = [
        ...conversationHistory.slice(-5),
        { role: 'user', content: userMessage }
      ]

      const response = await fetch('/.netlify/functions/openai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, messages })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.content != null && data.content !== '') {
          return data.content
        }
      }
    } catch (error) {
      console.log('Netlify function not available, using rule-based responses:', error?.message)
    }
    
    // Fallback to rule-based responses
    return getRuleBasedResponse(userMessage, simulationState)
  }
  
  // Process message (core logic)
  const processMessage = async (message) => {
    const trimmedMessage = typeof message === 'string' ? message.trim() : ''
    if (!trimmedMessage) {
      console.log('Empty message, skipping')
      return
    }
    
    console.log('Processing user message (text):', trimmedMessage)
    logEvent('AI_USER_PROMPT', { message: trimmedMessage })
    
    try {
      // Add user message to history
      addToConversation('user', trimmedMessage)
      
      // Get AI response
      const response = await getAIResponse(trimmedMessage)
      console.log('AI response generated:', response)
      
      if (!response) {
        console.warn('No AI response received')
        setRobotMessage("I'm sorry, I didn't get that. Could you try again?")
        return
      }
      
      // Add AI response to history
      addToConversation('assistant', response)
      logEvent('AI_ROBOT_RESPONSE', { response })
      
      // Display response
      setRobotMessage(response)
      
      // Speak response if voice mode is enabled
      if (isVoiceMode) {
        console.log('Voice mode active, speaking response')
        setTimeout(() => {
          speakMessage(response)
        }, 200)
      }
    } catch (err) {
      console.error('Error in processMessage:', err)
      setRobotMessage("Sorry, something went wrong. Please try again!")
    } finally {
      // Always clear input (controlled via state)
      setUserInput('')
      inputRef.current?.focus()
    }
  }
  
  // Handle sending message from text input (reads directly from input to avoid stale state)
  const handleSendMessage = () => {
    const value = inputRef.current?.value?.trim() ?? userInput?.trim()
    if (value) {
      processMessage(value)
    } else {
      console.log('handleSendMessage: no input to send')
    }
  }
  
  // Handle Enter key in text input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSendMessage()
    }
  }
  
  // Toggle voice mode
  const toggleVoiceMode = () => {
    const newMode = !isVoiceMode
    setIsVoiceMode(newMode)
    
    if (!newMode && synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }
  
  // Show welcome message when robot is first activated
  useEffect(() => {
    if (isRobotActive && !hasShownWelcome) {
      setRobotMessage("Hello! I'm your AI assistant. I'm here to help you with this spring dynamics experiment. Try asking me anything - like 'How do I start?' or 'What is Hooke's Law?' You can type or use voice mode!")
      setHasShownWelcome(true)
      
      // If voice mode, also speak the welcome
      if (isVoiceMode) {
        setTimeout(() => {
          speakMessage("Hello! I'm your AI assistant. I'm here to help you with this spring dynamics experiment.")
        }, 500)
      }
    }
  }, [isRobotActive, hasShownWelcome, setRobotMessage, isVoiceMode])
  
  if (!isRobotActive) {
    return null
  }
  
  return (
    <div className="ai-chat-interface">
      <div className="ai-chat-header">
        <h3>✨ 🤖 AI Assistant</h3>
        <button 
          className={`voice-mode-toggle ${isVoiceMode ? 'active' : ''}`}
          onClick={toggleVoiceMode}
          title={isVoiceMode ? 'Voice Mode On' : 'Voice Mode Off'}
        >
          {isVoiceMode ? '🔊' : '🔇'}
        </button>
      </div>
      
      {robotMessage && (
        <div className="robot-message-bubble">
          <div className="bubble-content">
            {isSpeaking && <span className="speaking-indicator">🔊 </span>}
            {robotMessage}
          </div>
        </div>
      )}
      
      <div className="chat-input-area">
        {isVoiceMode ? (
          <div className="voice-input-controls">
            <button 
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
            >
              {isListening ? '🎤 Listening... (speak now)' : '🎤 Hold to Speak'}
            </button>
            {userInput && <div className="voice-transcript">You said: "{userInput}"</div>}
            <div className="voice-status">
              {isListening ? '🔴 Microphone active' : '⚪ Click and hold button to speak'}
            </div>
            {isSpeaking && <div className="speaking-status">🔊 AI is speaking...</div>}
          </div>
        ) : (
          <div className="text-input-controls">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => {
                const v = e.target.value
                setUserInput(v)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your question and press Enter or click Send..."
              className="chat-input"
              autoComplete="off"
              aria-label="Type your question for the AI assistant"
            />
            <button 
              type="button"
              onClick={handleSendMessage}
              className="send-button"
              disabled={!userInput?.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        )}
      </div>
      
      <div className="chat-hints">
        <small>💡 Ask me about spring physics, how to use the simulation, or for hints!</small>
      </div>
    </div>
  )
}

export default AIChatInterface
