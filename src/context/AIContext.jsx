import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const AIContext = createContext()

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within AIProvider')
  }
  return context
}

export const AIProvider = ({ children }) => {
  const [isRobotActive, setIsRobotActive] = useState(false)
  const [robotMessage, setRobotMessage] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [userActions, setUserActions] = useState([])
  const [conversationHistory, setConversationHistory] = useState([])
  const actionLogRef = useRef([])

  // Track user actions
  const logAction = useCallback((actionType, details) => {
    const action = {
      timestamp: Date.now(),
      type: actionType,
      details
    }
    actionLogRef.current.push(action)
    setUserActions(prev => [...prev.slice(-20), action]) // Keep last 20 actions
  }, [])

  // Get simulation context for AI
  const getSimulationContext = useCallback((simulationState) => {
    const recentActions = actionLogRef.current.slice(-10)
    return {
      recentActions,
      simulationState,
      conversationHistory: conversationHistory.slice(-5)
    }
  }, [conversationHistory])

  // Add message to conversation history
  const addToConversation = useCallback((role, content) => {
    setConversationHistory(prev => [...prev, { role, content }])
  }, [])

  // Clear conversation (e.g. when user opens chat so each session starts fresh and level context is correct)
  const clearConversation = useCallback(() => {
    setConversationHistory([])
  }, [])

  return (
    <AIContext.Provider value={{
      isRobotActive,
      setIsRobotActive,
      robotMessage,
      setRobotMessage,
      isVoiceMode,
      setIsVoiceMode,
      userActions,
      logAction,
      getSimulationContext,
      conversationHistory,
      addToConversation,
      clearConversation
    }}>
      {children}
    </AIContext.Provider>
  )
}
