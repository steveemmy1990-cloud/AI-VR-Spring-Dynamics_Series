import React, { createContext, useContext, useState, useEffect } from 'react'

const TooltipContext = createContext()

export const useTooltip = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltip must be used within TooltipProvider')
  }
  return context
}

export const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track global mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const showTooltip = (text, x, y) => {
    // Use provided coordinates or fall back to current mouse position
    setTooltip({ show: true, text, x: x || mousePosition.x, y: y || mousePosition.y })
  }

  const hideTooltip = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 })
  }

  return (
    <TooltipContext.Provider value={{ tooltip, showTooltip, hideTooltip, mousePosition }}>
      {children}
    </TooltipContext.Provider>
  )
}
