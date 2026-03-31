import React, { createContext, useContext, useState } from 'react'

const PlankContext = createContext()

export const usePlank = () => {
  const context = useContext(PlankContext)
  if (!context) {
    throw new Error('usePlank must be used within PlankProvider')
  }
  return context
}

export const PlankProvider = ({ children }) => {
  const [plankPosition, setPlankPosition] = useState([-3, -4.95, 0]) // Y = floor + plank height/2 (floor at -5)
  const [isPlankInCenter, setIsPlankInCenter] = useState(false)
  const [attachedSprings, setAttachedSprings] = useState([]) // Track which springs are attached
  const [isMassAttached, setIsMassAttached] = useState(false) // Track if mass is attached to springs (blue, bottom)
  const [isMass1Attached, setIsMass1Attached] = useState(false) // Level 2: pink mass attached to plank (top)
  const [springLengths, setSpringLengths] = useState({}) // Track current length of each attached spring
  const [resetKey, setResetKey] = useState(0)
  
  // Warning popup state
  const [warningPopup, setWarningPopup] = useState({ show: false, message: '' })
  
  const showWarning = (message) => {
    setWarningPopup({ show: true, message })
  }
  
  const hideWarning = () => {
    setWarningPopup({ show: false, message: '' })
  }
  // Control panel state: spring stiffness (N/m) and mass weight (kg)
  const [springStiffness, setSpringStiffness] = useState({
    spring1: 2, // Starting at 2 N/m
    spring2: 2
  })
  const [massWeight, setMassWeight] = useState(1) // Starting at 1 kg (blue / Mass 2)
  const [massWeight1, setMassWeight1] = useState(1) // Level 2: pink mass (Mass 1), starting at 1 kg

  const resetExperiment = () => {
    setAttachedSprings([])
    setIsMassAttached(false)
    setIsMass1Attached(false)
    setIsPlankInCenter(false)
    setPlankPosition([-3, -4.95, 0])
    setSpringLengths({})
    setSpringStiffness({
      spring1: 2,
      spring2: 2
    })
    setMassWeight(1)
    setMassWeight1(1)
    setResetKey(prev => prev + 1)
  }

  return (
    <PlankContext.Provider value={{
      plankPosition,
      setPlankPosition,
      isPlankInCenter,
      setIsPlankInCenter,
      attachedSprings,
      setAttachedSprings,
      isMassAttached,
      setIsMassAttached,
      isMass1Attached,
      setIsMass1Attached,
      springLengths,
      setSpringLengths,
      springStiffness,
      setSpringStiffness,
      massWeight,
      setMassWeight,
      massWeight1,
      setMassWeight1,
      resetKey,
      resetExperiment,
      warningPopup,
      showWarning,
      hideWarning
    }}>
      {children}
    </PlankContext.Provider>
  )
}
