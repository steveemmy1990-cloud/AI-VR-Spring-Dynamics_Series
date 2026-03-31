import React, { useEffect } from 'react'
import { useAI } from '../context/AIContext'

const AIWelcomeMessage = () => {
  const { isRobotActive, setRobotMessage } = useAI()
  
  useEffect(() => {
    if (isRobotActive) {
      // Show welcome message when robot is first activated
      setRobotMessage("Hello! I'm your AI assistant. I can help you with this spring dynamics experiment. Try saying 'Hi' or ask me 'How do I start?'")
    }
  }, [isRobotActive, setRobotMessage])
  
  return null
}

export default AIWelcomeMessage
