import React from 'react'
import { usePlank } from '../context/PlankContext'
import './WarningPopup.css'

const WarningPopup = () => {
  const { warningPopup, hideWarning } = usePlank()
  
  if (!warningPopup.show) return null
  
  return (
    <div className="warning-popup-overlay">
      <div className="warning-popup">
        <div className="warning-popup-icon">⚠️</div>
        <div className="warning-popup-title">Cannot Attach Mass</div>
        <div className="warning-popup-message">{warningPopup.message}</div>
        <button className="warning-popup-button" onClick={hideWarning}>
          OK
        </button>
      </div>
    </div>
  )
}

export default WarningPopup
