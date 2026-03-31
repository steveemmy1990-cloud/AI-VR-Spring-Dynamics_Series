import React from 'react'
import './WelcomePage.css'

const WelcomePage = ({ onEnter }) => {
  return (
    <div className="welcome-container">
      <div className="tech-lines left"></div>
      <div className="welcome-content">
        <h2 className="welcome-top-text">Welcome to the</h2>
        <h1 className="welcome-title">Spring Dynamics Simulation</h1>
        <h3 className="welcome-subtitle" data-arrangement="series">
          Series Arrangement
        </h3>
        <p className="welcome-note">Springs connected end-to-end in a chain</p>
        
        <button className="enter-button" onClick={onEnter}>
          Click here to enter
        </button>
      </div>
    </div>
  )
}

export default WelcomePage
