import React, { useState } from 'react'
import { usePlank } from '../context/PlankContext'
import { useAI } from '../context/AIContext'
import { useData } from '../context/DataContext'
import { useFeedback } from '../context/FeedbackContext'
import { useLevel } from '../context/LevelContext'
import ResultsBox from './ResultsBox'
import './ControlPanel.css'

const ControlPanel = ({ onOpenQuiz }) => {
  const { springStiffness, setSpringStiffness, massWeight, setMassWeight, massWeight1, setMassWeight1, resetExperiment, isPlankInCenter, attachedSprings, isMassAttached, isMass1Attached } = usePlank()
  const { logAction } = useAI()
  const { logEvent } = useData()
  const { showSuccess } = useFeedback()
  const { level, setLevel1Complete, setLevel2Complete, setHasAdjustedSettings, showLevel1Incomplete, hasAdjustedSettings, level1Complete } = useLevel()
  const [showResults, setShowResults] = useState(false)

  const handleSpringStiffnessChange = (springId, value) => {
    const newValue = parseInt(value)
    setSpringStiffness(prev => ({
      ...prev,
      [springId]: newValue
    }))
    setHasAdjustedSettings(true) // User has adjusted settings (required to unlock Level 2)
    logAction('SPRING_STIFFNESS_CHANGED', { springId, value: newValue })
    logEvent('SPRING_STIFFNESS_CHANGED', { springId, value: newValue })
  }

  const handleMassWeightChange = (value) => {
    const newValue = parseInt(value)
    setMassWeight(newValue)
    setHasAdjustedSettings(true)
    logAction('MASS_WEIGHT_CHANGED', { value: newValue })
    logEvent('MASS_WEIGHT_CHANGED', { value: newValue })
  }

  const handleMassWeight1Change = (value) => {
    const newValue = parseInt(value)
    setMassWeight1(newValue)
    setHasAdjustedSettings(true)
    logAction('MASS_WEIGHT1_CHANGED', { value: newValue })
    logEvent('MASS_WEIGHT1_CHANGED', { value: newValue })
  }

  const level1RequirementsMet = () => {
    return isPlankInCenter && attachedSprings.length >= 2 && isMassAttached
  }

  const level2RequirementsMet = () => {
    return isPlankInCenter && attachedSprings.length >= 2 && isMass1Attached && isMassAttached
  }

  const handleTakeReading = () => {
    setShowResults(true)
    logAction('TAKE_READING_CLICKED', { springStiffness, massWeight, massWeight1 })
    logEvent('TAKE_READING_CLICKED', { springStiffness, massWeight, massWeight1 })

    if (level === 1) {
      const requirementsMet = level1RequirementsMet()
      if (requirementsMet && hasAdjustedSettings) {
        setLevel1Complete(true) // Unlock Level 2 only when full experiment is done
        showSuccess('Reading taken! Check the results below.')
      } else {
        showLevel1Incomplete() // Show message: complete full setup to unlock Level 2 (no success popup)
      }
    } else {
      // Level 2: unlock Knowledge quiz only when full setup and take reading
      const requirementsMet = level2RequirementsMet()
      if (requirementsMet && hasAdjustedSettings) {
        setLevel2Complete(true)
      }
      showSuccess('Reading taken! Check the results below.')
    }
  }

  const handleReset = () => {
    if (level === 2) setLevel2Complete(false)
    resetExperiment()
    logAction('EXPERIMENT_RESET', {})
    logEvent('EXPERIMENT_RESET', {})
  }

  return (
    <div className="control-panel">
      <h2 className="control-panel-title">✨ Control Panel</h2>
      
      <div className="control-section">
        <h3 className="section-title">Spring Stiffness (N/m²)</h3>
        
        <div className="slider-group">
          <label className="slider-label">
            Spring 1: {springStiffness.spring1} N/m²
          </label>
          <input
            type="range"
            min="2"
            max="50"
            step="1"
            value={springStiffness.spring1}
            onChange={(e) => handleSpringStiffnessChange('spring1', e.target.value)}
            className="slider"
          />
        </div>
        
        <div className="slider-group">
          <label className="slider-label">
            Spring 2: {springStiffness.spring2} N/m²
          </label>
          <input
            type="range"
            min="2"
            max="50"
            step="1"
            value={springStiffness.spring2}
            onChange={(e) => handleSpringStiffnessChange('spring2', e.target.value)}
            className="slider"
          />
        </div>
      </div>
      
      <div className="control-section">
        <h3 className="section-title">Mass Weight (kg)</h3>
        {level === 2 ? (
          <>
            <div className="slider-group">
              <label className="slider-label">
                Mass 1 (pink): {massWeight1} kg
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={massWeight1}
                onChange={(e) => handleMassWeight1Change(e.target.value)}
                className="slider"
              />
            </div>
            <div className="slider-group">
              <label className="slider-label">
                Mass 2 (blue): {massWeight} kg
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={massWeight}
                onChange={(e) => handleMassWeightChange(e.target.value)}
                className="slider"
              />
            </div>
          </>
        ) : (
          <div className="slider-group">
            <label className="slider-label">
              Mass: {massWeight} kg
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={massWeight}
              onChange={(e) => handleMassWeightChange(e.target.value)}
              className="slider"
            />
          </div>
        )}
      </div>
      
      <div className="button-group">
        <button 
          className="take-reading-button"
          onClick={handleTakeReading}
        >
          Take reading
        </button>
        
        <button 
          className="reset-button"
          onClick={handleReset}
        >
          Reset Experiment
        </button>

        <button
          type="button"
          className="quiz-button"
          onClick={() => onOpenQuiz?.()}
        >
          📝 Knowledge quiz
        </button>
      </div>
      
      {showResults && (
        <ResultsBox onClose={() => setShowResults(false)} />
      )}
    </div>
  )
}

export default ControlPanel
