import React, { createContext, useContext, useState } from 'react'

const LevelContext = createContext()

export const useLevel = () => {
  const context = useContext(LevelContext)
  if (!context) {
    throw new Error('useLevel must be used within LevelProvider')
  }
  return context
}

export const LevelProvider = ({ children }) => {
  const [level, setLevel] = useState(1) // 1 = Guided (with hints), 2 = Challenge (less scaffolding)
  const [level1Complete, setLevel1Complete] = useState(false)
  const [level2Complete, setLevel2Complete] = useState(false) // Level 2 simulation completed (take reading with full setup)
  const [hasFinishedLevel1, setHasFinishedLevel1] = useState(false) // true after user clicks Finished in Level 1
  const [level1QuizCompleted, setLevel1QuizCompleted] = useState(false) // true after user completes Knowledge quiz in Level 1
  const [level2QuizCompleted, setLevel2QuizCompleted] = useState(false) // true after user completes Knowledge quiz in Level 2
  const [showLevel2LockedMessage, setShowLevel2LockedMessage] = useState(false)
  const [showLevel1IncompleteMessage, setShowLevel1IncompleteMessage] = useState(false)
  const [showFinishFirstMessage, setShowFinishFirstMessage] = useState(false) // must click Finished before Level 2
  const [hasAdjustedSettings, setHasAdjustedSettings] = useState(false)

  const isGuided = level === 1
  const isChallenge = level === 2

  const showLevel2Locked = () => setShowLevel2LockedMessage(true)
  const hideLevel2Locked = () => setShowLevel2LockedMessage(false)
  const showLevel1Incomplete = () => setShowLevel1IncompleteMessage(true)
  const hideLevel1Incomplete = () => setShowLevel1IncompleteMessage(false)
  const showFinishFirst = () => setShowFinishFirstMessage(true)
  const hideFinishFirst = () => setShowFinishFirstMessage(false)

  return (
    <LevelContext.Provider value={{
      level,
      setLevel,
      isGuided,
      isChallenge,
      level1Complete,
      setLevel1Complete,
      level2Complete,
      setLevel2Complete,
      hasFinishedLevel1,
      setHasFinishedLevel1,
      level1QuizCompleted,
      setLevel1QuizCompleted,
      level2QuizCompleted,
      setLevel2QuizCompleted,
      showLevel2LockedMessage,
      showLevel2Locked,
      hideLevel2Locked,
      showLevel1IncompleteMessage,
      showLevel1Incomplete,
      hideLevel1Incomplete,
      showFinishFirstMessage,
      showFinishFirst,
      hideFinishFirst,
      hasAdjustedSettings,
      setHasAdjustedSettings
    }}>
      {children}
    </LevelContext.Provider>
  )
}
