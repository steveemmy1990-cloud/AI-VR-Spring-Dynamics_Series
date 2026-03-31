import React from 'react'
import { usePlank } from '../context/PlankContext'
import { useLevel } from '../context/LevelContext'
import './ResultsBox.css'

const ResultsBox = ({ onClose }) => {
  const { springStiffness, massWeight, massWeight1, attachedSprings, springLengths, isMassAttached, isMass1Attached } = usePlank()
  const { level } = useLevel()
  
  const GRAVITY = 9.8 // m/s²
  const REST_LENGTH = 2.5 // meters
  
  const isTwoMassMode = level === 2 && isMass1Attached
  
  const calculateResults = () => {
    if (!isMassAttached || attachedSprings.length === 0) {
      return {
        hasData: false,
        message: level === 2
          ? 'In Level 2: suspend plank, attach Spring 1, then pink mass (Mass 1), then Spring 2, then blue mass (Mass 2). Adjust sliders and take a reading.'
          : 'Please attach at least one spring to the plank and attach the mass to see calculations.'
      }
    }
    if (level === 2 && !isMass1Attached) {
      return {
        hasData: false,
        message: 'In Level 2: attach Spring 1 to the plank, then the pink mass (Mass 1) below Spring 1, then Spring 2, then the blue mass (Mass 2).'
      }
    }
    
    const attachedStiffness = attachedSprings.map(springId => {
      return springStiffness[springId] || 2.0
    })
    
    const reciprocalSum = attachedStiffness.reduce((sum, k) => sum + (1 / k), 0)
    const totalSpringConstant = 1 / reciprocalSum

    // Level 2: plank → S1 → M1 → S2 → M2. F1 = (m1+m2)g, F2 = m2*g. Level 1: single force mg.
    const forcePerSpring = isTwoMassMode
      ? [(massWeight1 + massWeight) * GRAVITY, massWeight * GRAVITY]
      : attachedStiffness.map(() => massWeight * GRAVITY)
    const forceFromMass = isTwoMassMode
      ? (massWeight1 + massWeight) * GRAVITY
      : massWeight * GRAVITY

    const extensionPerSpring = attachedStiffness.map((k, i) => forcePerSpring[i] / k)
    const totalExtension = extensionPerSpring.reduce((sum, ext) => sum + ext, 0)
    
    // Get actual current lengths from simulation
    const currentLengths = attachedSprings.map(springId => {
      return springLengths[springId] || REST_LENGTH
    })
    
    // Calculate actual extensions (current length - rest length)
    const actualExtensions = currentLengths.map(length => length - REST_LENGTH)
    
    // Average actual extension
    const avgActualExtension = actualExtensions.reduce((sum, ext) => sum + ext, 0) / actualExtensions.length
    
    return {
      hasData: true,
      numberOfSprings: attachedSprings.length,
      springStiffness: attachedStiffness,
      totalSpringConstant,
      massWeight,
      massWeight1,
      isTwoMassMode,
      forceFromMass,
      totalExtension,
      forcePerSpring,
      extensionPerSpring,
      currentLengths,
      actualExtensions,
      avgActualExtension,
      forceOnSpring1: isTwoMassMode ? (massWeight1 + massWeight) * GRAVITY : massWeight * GRAVITY,
      forceOnSpring2: isTwoMassMode ? massWeight * GRAVITY : massWeight * GRAVITY
    }
  }
  
  const results = calculateResults()
  
  return (
    <div className="results-overlay" onClick={onClose}>
      <div className="results-box" onClick={(e) => e.stopPropagation()}>
        <button className="results-close-button" onClick={onClose}>×</button>
        
        <h2 className="results-title"><span className="results-title-icon">✨</span> Experiment Results</h2>
        
        {!results.hasData ? (
          <div className="results-message">
            <p>{results.message}</p>
          </div>
        ) : (
          <div className="results-content">
            <div className="results-section">
              <h3>Given Values</h3>
              {results.isTwoMassMode ? (
                <>
                  <div className="results-item">
                    <strong>Mass 1 (pink, m₁):</strong> {results.massWeight1} kg
                  </div>
                  <div className="results-item">
                    <strong>Mass 2 (blue, m₂):</strong> {results.massWeight} kg
                  </div>
                  <div className="results-item">
                    <strong>Total mass (m₁ + m₂):</strong> {results.massWeight1 + results.massWeight} kg
                  </div>
                </>
              ) : (
                <div className="results-item">
                  <strong>Mass (m):</strong> {results.massWeight} kg
                </div>
              )}
              <div className="results-item">
                <strong>Gravity (g):</strong> {GRAVITY} m/s²
              </div>
              <div className="results-item">
                <strong>Number of Springs:</strong> {results.numberOfSprings}
              </div>
              <div className="results-item">
                <strong>Spring Stiffness:</strong>
                <ul className="spring-list">
                  {results.springStiffness.map((k, index) => (
                    <li key={index}>Spring {index + 1}: k{index + 1} = {k} N/m²</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="results-section">
              <h3>Formulas Used</h3>
              <div className="formula-box">
                <p><strong>Force on springs{results.isTwoMassMode ? ' (plank → S1 → M1 → S2 → M2)' : ''}:</strong></p>
                {results.isTwoMassMode ? (
                  <>
                    <p className="formula">Spring 1 supports both masses: F₁ = (m₁ + m₂) × g = {results.forceOnSpring1.toFixed(2)} N</p>
                    <p className="formula">Spring 2 supports only Mass 2: F₂ = m₂ × g = {results.forceOnSpring2.toFixed(2)} N</p>
                  </>
                ) : (
                  <>
                    <p className="formula">F = m × g</p>
                    <p className="formula">F = {results.massWeight} × {GRAVITY} = {results.forceFromMass.toFixed(2)} N</p>
                  </>
                )}
              </div>
              
              <div className="formula-box">
                <p><strong>Total Spring Constant (Series Springs):</strong></p>
                <p className="formula">1/k<sub>total</sub> = 1/k<sub>1</sub> + 1/k<sub>2</sub> + 1/k<sub>3</sub></p>
                <p className="formula">1/k<sub>total</sub> = {results.springStiffness.map(k => `1/${k}`).join(' + ')} = {results.totalSpringConstant > 0 ? (1/results.totalSpringConstant).toFixed(4) : 'N/A'}</p>
                <p className="formula">k<sub>total</sub> = {results.totalSpringConstant.toFixed(4)} N/m²</p>
              </div>
              
              <div className="formula-box">
                <p><strong>Extension per Spring (Hooke's Law):</strong></p>
                <p className="formula">x<sub>i</sub> = F<sub>i</sub> / k<sub>i</sub></p>
                {results.extensionPerSpring.map((ext, index) => (
                  <p key={index} className="formula">
                    x<sub>{index + 1}</sub> = {results.forcePerSpring[index].toFixed(2)} / {results.springStiffness[index]} = {ext.toFixed(4)} m
                  </p>
                ))}
              </div>
              
              <div className="formula-box">
                <p><strong>Total Extension (Series Arrangement):</strong></p>
                <p className="formula">x<sub>total</sub> = x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub></p>
                <p className="formula">x<sub>total</sub> = {results.extensionPerSpring.map(ext => ext.toFixed(4)).join(' + ')} = {results.totalExtension.toFixed(4)} m</p>
              </div>
              
              <div className="formula-box">
                <p><strong>Force per Spring:</strong></p>
                {results.isTwoMassMode ? (
                  <>
                    <p className="formula">F₁ = {results.forcePerSpring[0].toFixed(2)} N, F₂ = {results.forcePerSpring[1].toFixed(2)} N</p>
                  </>
                ) : (
                  <>
                    <p className="formula">F<sub>per spring</sub> = F<sub>total</sub> (same force through all springs) = {results.forcePerSpring[0].toFixed(2)} N</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="results-section">
              <h3>Calculated Results</h3>
              <div className="results-item">
                <strong>Total Force (Spring 1):</strong> {results.forcePerSpring[0].toFixed(2)} N
                {results.isTwoMassMode && (
                  <><br /><strong>Force on Spring 2:</strong> {results.forcePerSpring[1].toFixed(2)} N</>
                )}
              </div>
              <div className="results-item">
                <strong>Total Spring Constant:</strong> {results.totalSpringConstant} N/m²
              </div>
              <div className="results-item">
                <strong>Theoretical Total Extension:</strong> {results.totalExtension.toFixed(4)} m ({(results.totalExtension * 100).toFixed(2)} cm)
              </div>
              <div className="results-item">
                <strong>Force per Spring:</strong> {results.forcePerSpring.map((f, i) => `Spring ${i + 1}: ${f.toFixed(2)} N`).join(', ')}
              </div>
              <div className="results-item">
                <strong>Extension per Spring:</strong>
                <ul className="spring-list">
                  {results.extensionPerSpring.map((ext, index) => (
                    <li key={index}>Spring {index + 1}: {ext.toFixed(4)} m ({(ext * 100).toFixed(2)} cm)</li>
                  ))}
                </ul>
              </div>
              <div className="results-item">
                <strong>Total Extension (Sum of all springs):</strong> {results.totalExtension.toFixed(4)} m ({(results.totalExtension * 100).toFixed(2)} cm)
              </div>
              <div className="results-item">
                <strong>Actual Average Extension (from simulation):</strong> {results.avgActualExtension.toFixed(4)} m ({(results.avgActualExtension * 100).toFixed(2)} cm)
              </div>
            </div>
            
            <div className="results-section">
              <h3>Explanation</h3>
              <div className="explanation-text">
                <p>
                  When springs are arranged in <strong>series</strong>, they are connected end-to-end. 
                  The same force passes through all springs, but each spring extends by a different amount 
                  based on its individual stiffness. The total spring constant is calculated as 
                  1/k<sub>total</sub> = 1/k<sub>1</sub> + 1/k<sub>2</sub> + 1/k<sub>3</sub>.
                </p>
                <p>
                  The force from the mass (F = m × g) is the <strong>same</strong> through all springs in series. 
                  Unlike parallel arrangement, the force is not divided among springs.
                </p>
                <p>
                  According to <strong>Hooke's Law</strong> (F = -kx), each spring extends by x<sub>i</sub> = F / k<sub>i</sub>, 
                  where F is the same for all springs. The <strong>total extension</strong> is the 
                  <strong>sum</strong> of all individual extensions: x<sub>total</sub> = x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub>.
                </p>
                <p>
                  <strong>Higher stiffness</strong> means the spring resists deformation more, 
                  resulting in <strong>less extension</strong> for that spring. 
                  <strong>Higher mass</strong> creates more force, causing <strong>more extension</strong> in all springs. 
                  In series, weaker springs (lower k) extend more than stiffer springs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsBox
