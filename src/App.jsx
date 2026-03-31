import React, { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Spring from './components/Spring'
import Plank from './components/Plank'
import Block from './components/Block'
import PinkBlock from './components/PinkBlock'
import LabRoom from './components/LabRoom'
import ControlPanel from './components/ControlPanel'
import Robot from './components/Robot'
import AIChatInterface from './components/AIChatInterface'
import Movement from './components/Movement'
import WelcomePage from './components/WelcomePage'
import IntroPage from './components/IntroPage'
import { PlankProvider, usePlank } from './context/PlankContext'
import { AIProvider, useAI } from './context/AIContext'
import { DataProvider, useData } from './context/DataContext'
import { TooltipProvider } from './context/TooltipContext'
import { FeedbackProvider } from './context/FeedbackContext'
import { LevelProvider, useLevel } from './context/LevelContext'
import WarningPopup from './components/WarningPopup'
import FeedbackAnimation from './components/FeedbackAnimation'
import VideoModal from './components/VideoModal'
import Tooltip from './components/Tooltip'
import Quiz from './components/Quiz'
import { isValidParticipantId, normalizeParticipantId } from './data/participantIds'
import './App.css'

function Controls() {
  const controlsRef = useRef()
  
  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current
      if (controls && controls.mouseButtons !== undefined) {
        controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE
        controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY
        controls.mouseButtons.RIGHT = THREE.MOUSE.PAN
      } else if (controls) {
        controls.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }
      }
    }
  }, [])
  
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={30}
    />
  )
}

const ROBOT_INITIAL_POSITION = [-6, -4.275, 0] // Y so robot feet touch floor (floor at -5; robot feet bottom at group Y - 0.725)
const PLANK_INITIAL_POSITION = [-3, 0, 0]
const BLOCK_INITIAL_POSITION = [4, 0, 2]
const PINK_BLOCK_INITIAL_POSITION = [3, 0, -2] // Level 2: second mass (pink), other side of scene
const SPRING1_INITIAL_POSITION = [4, -1.5, -1]
const SPRING2_INITIAL_POSITION = [4, -1.5, 0]

function AppContent() {
  const [appState, setAppState] = React.useState('welcome') // 'welcome', 'intro', 'sign-in', 'simulation'
  const [nameInput, setNameInput] = React.useState('')
  const [nameError, setNameError] = React.useState('')
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false)
  const [hasClickedTutorial, setHasClickedTutorial] = React.useState(false)
  const [isQuizOpen, setIsQuizOpen] = React.useState(false)
  const [showQuizLockedMessage, setShowQuizLockedMessage] = React.useState(false)
  const [showQuizRequiredBeforeFinishMessage, setShowQuizRequiredBeforeFinishMessage] = React.useState(false)
  const { setIsDataCollectionActive, downloadData, uploadToSupabaseByLevel, isSupabaseConfigured, logEvent, setUserId } = useData()
  const { level, setLevel, isGuided, level1Complete, level2Complete, setLevel2Complete, hasFinishedLevel1, setHasFinishedLevel1, level1QuizCompleted, setLevel1QuizCompleted, level2QuizCompleted, setLevel2QuizCompleted, showLevel2Locked, hideLevel2Locked, showLevel2LockedMessage, showLevel1IncompleteMessage, hideLevel1Incomplete, showFinishFirst, hideFinishFirst, showFinishFirstMessage } = useLevel()
  const { resetExperiment } = usePlank()
  const { clearConversation } = useAI()
  
  // Convert YouTube short URL to embed format
  const VIDEO_URL = 'https://www.youtube.com/embed/hEFlctCYe-A'
  
  const handleSignIn = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setNameError('Please enter your participant ID.')
      return
    }
    if (!isValidParticipantId(trimmed)) {
      setNameError('This participant ID is not recognized. Only pre-assigned IDs can access the system.')
      return
    }

    const participantId = normalizeParticipantId(trimmed)
    setUserId(participantId)
    setIsDataCollectionActive(true)
    setAppState('simulation')
    logEvent('EXPERIMENT_STARTED', { userId: participantId })
  }

  const handleSignInKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn()
    }
  }

  const handleFinish = async () => {
    if (level === 1 && !level1QuizCompleted) {
      setShowQuizRequiredBeforeFinishMessage(true)
      return
    }
    if (level === 2 && !level2QuizCompleted) {
      setShowQuizRequiredBeforeFinishMessage(true)
      return
    }
    logEvent('EXPERIMENT_FINISHED', {})
    const forLevel = level
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    if (isLocalhost) {
      downloadData(forLevel)
      if (forLevel === 1) setHasFinishedLevel1(true)
      alert(forLevel === 1 ? 'Level 1 data downloaded. You can now click Level 2 when ready.' : 'Data downloaded. Thank you for participating!')
      return
    }

    if (isSupabaseConfigured) {
      let result
      try {
        result = await uploadToSupabaseByLevel(forLevel)
      } catch (err) {
        result = { ok: false, error: err?.message || 'Failed to fetch' }
      }
      if (result.ok) {
        if (forLevel === 1) setHasFinishedLevel1(true)
        alert(forLevel === 1 ? 'Level 1 data saved. You can now click Level 2 when ready.' : 'Data saved. Thank you for participating!')
      } else {
        downloadData(forLevel)
        if (forLevel === 1) setHasFinishedLevel1(true)
        alert(forLevel === 1
          ? 'Could not reach the server; your data has been downloaded to this device instead. You can now click Level 2 when ready.'
          : 'Could not reach the server; your data has been downloaded to this device instead. Thank you for participating!')
      }
    } else {
      downloadData(forLevel)
      if (forLevel === 1) setHasFinishedLevel1(true)
      alert(
        (forLevel === 1 ? 'Level 1 data downloaded. You can now click Level 2 when ready.' : 'Data downloaded. Thank you for participating!') +
        ' (Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify to send data to Supabase.)'
      )
    }
  }

  const handleLevel2Click = () => {
    if (!level1Complete) {
      showLevel2Locked()
      return
    }
    if (!hasFinishedLevel1) {
      showFinishFirst()
      return
    }
    clearConversation()
    resetExperiment()
    setLevel2Complete(false) // Quiz locked until Level 2 simulation is completed
    setLevel(2)
    logEvent('LEVEL_CHANGED', { toLevel: 2 })
  }

  const handleOpenQuiz = () => {
    if (level === 1) {
      if (!level1Complete) {
        setShowQuizLockedMessage(true)
        return
      }
    } else {
      // Level 2: require Level 2 simulation completed (full setup + take reading)
      if (!level2Complete) {
        setShowQuizLockedMessage(true)
        return
      }
    }
    setIsQuizOpen(true)
  }

  return (
    <div className="app">
      {appState === 'welcome' && (
        <WelcomePage onEnter={() => setAppState('intro')} />
      )}
      
      {appState === 'intro' && (
        <IntroPage onStart={() => setAppState('sign-in')} />
      )}

      {appState === 'sign-in' && (
        <div className="data-selection-overlay">
          <div className="data-selection-box sign-in-box">
            <h2>Participant Sign In</h2>

            <div className="data-notice">
              <div className="notice-icon">&#x1F4CA;</div>
              <p>
                <strong>Data Collection Notice:</strong> Your simulation activities,
                interactions, and activity logs will be collected as research data.
                This data will be used for educational research purposes only.
                Participation is anonymous; use only the participant ID assigned to you.
              </p>
            </div>

            <div className="sign-in-form">
              <label htmlFor="participant-id">Please enter your Participant ID:</label>
              <input
                type="text"
                id="participant-id"
                className="name-input"
                placeholder="e.g. PART-001"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value)
                  setNameError('')
                }}
                onKeyPress={handleSignInKeyPress}
                autoFocus
              />
              {nameError && <div className="name-error">{nameError}</div>}

              <button className="sign-in-btn" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {appState === 'simulation' && (
        <div className="simulation-buttons-wrap" style={{ pointerEvents: 'none' }}>
          <button className="finish-btn" style={{ pointerEvents: 'auto' }} onClick={handleFinish}>
            Finished
          </button>
          {isGuided && (
            <button
              className={`watch-tutorial-btn ${hasClickedTutorial ? 'no-blink' : ''}`}
              style={{ pointerEvents: 'auto' }}
              onClick={() => {
                setHasClickedTutorial(true)
                setIsVideoModalOpen(true)
              }}
            >
              📹 Watch Tutorial
            </button>
          )}
          {isGuided && (
            <button className="challenge-level-btn" style={{ pointerEvents: 'auto' }} onClick={handleLevel2Click}>
              Level 2
            </button>
          )}
        </div>
      )}

      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
        style={{ pointerEvents: appState === 'simulation' ? 'auto' : 'none' }}
      >
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
        
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Environment preset="sunset" />
        <LabRoom level={level} />
        {level === 1 && <gridHelper args={[20, 20]} position={[0, -5, 0]} />}
        
        <Robot position={ROBOT_INITIAL_POSITION} />
        <Plank length={4} width={0.3} height={0.1} position={PLANK_INITIAL_POSITION} />
        <Block length={4} width={0.3} height={0.3} position={BLOCK_INITIAL_POSITION} />
        {level === 2 && <PinkBlock length={4} width={0.3} height={0.3} position={PINK_BLOCK_INITIAL_POSITION} />}
        
        <Spring initialGroupPosition={SPRING1_INITIAL_POSITION} springId="spring1" />
        <Spring initialGroupPosition={SPRING2_INITIAL_POSITION} springId="spring2" />
        
        <Controls />
        <Movement />
      </Canvas>
      
      {appState === 'simulation' && <ControlPanel onOpenQuiz={handleOpenQuiz} />}
      {appState === 'simulation' && <AIChatInterface />}
      
      {/* Warning popup for mass attachment errors */}
      <WarningPopup />

      {/* Level 2 locked message - complete Level 1 first */}
      {showLevel2LockedMessage && (
        <div className="level2-locked-overlay">
          <div className="level2-locked-box">
            <div className="level2-locked-icon">🔒</div>
            <h3>Level 2 is locked</h3>
            <p>Please complete Level 1 first before unlocking Level 2.</p>
            <p className="level2-locked-hint">Suspend the plank, attach both springs, attach the mass, adjust the spring and mass settings with the sliders, then click &quot;Take reading&quot; to complete Level 1.</p>
            <button className="level2-locked-btn" onClick={hideLevel2Locked}>OK</button>
          </div>
        </div>
      )}

      {/* Level 1 incomplete - take reading clicked but full setup not done (Disney Pixar-style) */}
      {showLevel1IncompleteMessage && (
        <div className="level1-incomplete-overlay">
          <div className="level1-incomplete-box">
            <div className="level1-incomplete-icon">✨</div>
            <h3>Almost there!</h3>
            <p>To unlock Level 2, complete the full experiment:</p>
            <ul className="level1-incomplete-list">
              <li>Suspend the plank (double-click it)</li>
              <li>Attach both springs (double-click each)</li>
              <li>Attach the mass (double-click the blue block)</li>
              <li>Adjust the spring stiffness and mass sliders</li>
              <li>Then click &quot;Take reading&quot;</li>
            </ul>
            <p className="level1-incomplete-note">Your reading is saved — just finish the steps above and take another reading to unlock Level 2!</p>
            <button className="level1-incomplete-btn" onClick={hideLevel1Incomplete}>Got it</button>
          </div>
        </div>
      )}

      {/* Must click Finished before Level 2 (Disney Pixar-style) */}
      {showFinishFirstMessage && (
        <div className="finish-first-overlay">
          <div className="finish-first-box">
            <div className="finish-first-icon">📤</div>
            <h3>Save Level 1 data first</h3>
            <p className="finish-first-lead">You must click the <strong>Finished</strong> button to save your Level 1 data before you can proceed to Level 2.</p>
            <p className="finish-first-note">Click Finished now, then return here and click Level 2.</p>
            <button type="button" className="finish-first-btn" onClick={hideFinishFirst}>I&apos;ll click Finished first</button>
          </div>
        </div>
      )}

      {/* Knowledge test locked – complete experiment and take reading first (Disney Pixar-style) */}
      {showQuizLockedMessage && (
        <div className="quiz-locked-overlay">
          <div className="quiz-locked-box">
            <div className="quiz-locked-icon">📝</div>
            <h3>Complete the experiment first</h3>
            <p className="quiz-locked-lead">You need to complete the simulation and take a reading before you can take the knowledge test.</p>
            <p className="quiz-locked-hint">{level === 2 ? 'Suspend the plank, attach both springs, attach both masses (pink and blue), adjust the sliders, then click &quot;Take reading&quot;. After that, the Knowledge quiz will be available.' : 'Suspend the plank, attach both springs, attach the mass, adjust the sliders, then click &quot;Take reading&quot;. After that, the Knowledge quiz will be available.'}</p>
            <button type="button" className="quiz-locked-btn" onClick={() => setShowQuizLockedMessage(false)}>Got it</button>
          </div>
        </div>
      )}

      {/* Finish blocked – complete Knowledge quiz before submitting (both levels) */}
      {showQuizRequiredBeforeFinishMessage && (
        <div className="quiz-locked-overlay">
          <div className="quiz-locked-box">
            <div className="quiz-locked-icon">📋</div>
            <h3>Complete the Knowledge quiz first</h3>
            <p className="quiz-locked-lead">Please complete the Knowledge quiz before finishing and submitting your data.</p>
            <p className="quiz-locked-hint">Click the &quot;Knowledge quiz&quot; button in the Control Panel, answer the 10 questions, then return here and click Finished.</p>
            <button type="button" className="quiz-locked-btn" onClick={() => setShowQuizRequiredBeforeFinishMessage(false)}>Got it</button>
          </div>
        </div>
      )}
      
      {/* Video modal for tutorial */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={VIDEO_URL}
      />

      {/* Knowledge quiz – Disney Pixar style */}
      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onQuizComplete={(result) => {
          logEvent('QUIZ_RESULT', result)
          if (level === 1) setLevel1QuizCompleted(true)
          if (level === 2) setLevel2QuizCompleted(true)
        }}
      />
      
      {/* Tooltip only in Guided level */}
      {isGuided && <Tooltip />}
      
      {/* Step feedback - Disney Pixar style (Guided level only) */}
      {isGuided && <FeedbackAnimation />}
    </div>
  )
}

function App() {
  return (
    <AIProvider>
      <LevelProvider>
        <DataProvider>
          <TooltipProvider>
            <FeedbackProvider>
              <PlankProvider>
                <AppContent />
              </PlankProvider>
            </FeedbackProvider>
          </TooltipProvider>
        </DataProvider>
      </LevelProvider>
    </AIProvider>
  )
}

export default App
