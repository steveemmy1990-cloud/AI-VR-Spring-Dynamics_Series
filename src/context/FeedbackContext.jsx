import React, { createContext, useContext, useState } from 'react'

const FeedbackContext = createContext()

export const useFeedback = () => {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider')
  }
  return context
}

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState({ show: false, type: null, message: '' })

  const showSuccess = (message) => {
    setFeedback({ show: true, type: 'success', message })
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setFeedback({ show: false, type: null, message: '' })
    }, 3000)
  }

  const showFailure = (message) => {
    setFeedback({ show: true, type: 'failure', message })
    // Auto-hide after 2.5 seconds
    setTimeout(() => {
      setFeedback({ show: false, type: null, message: '' })
    }, 2500)
  }

  const hideFeedback = () => {
    setFeedback({ show: false, type: null, message: '' })
  }

  return (
    <FeedbackContext.Provider value={{ feedback, showSuccess, showFailure, hideFeedback }}>
      {children}
    </FeedbackContext.Provider>
  )
}
