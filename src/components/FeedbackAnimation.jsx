import React from 'react'
import { useFeedback } from '../context/FeedbackContext'
import './FeedbackAnimation.css'

const FeedbackAnimation = () => {
  const { feedback } = useFeedback()

  if (!feedback.show) return null

  return (
    <div className={`feedback-overlay feedback-${feedback.type}`}>
      {feedback.type === 'success' && (
        <div className="feedback-pixar success">
          <div className="feedback-sparkle">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="feedback-star"
                style={{
                  '--delay': `${i * 0.08}s`,
                  '--angle': `${(i * 30)}deg`,
                  '--distance': '70px'
                }}
              >
                ⭐
              </div>
            ))}
          </div>
          <div className="feedback-pixar-box success-box">
            <div className="feedback-pixar-icon">✨</div>
            <h3 className="feedback-pixar-title">You got it!</h3>
            <p className="feedback-pixar-message">{feedback.message}</p>
          </div>
        </div>
      )}

      {feedback.type === 'failure' && (
        <div className="feedback-pixar failure">
          <div className="feedback-pixar-box failure-box">
            <div className="feedback-pixar-icon">💡</div>
            <h3 className="feedback-pixar-title">Not quite yet</h3>
            <p className="feedback-pixar-message">{feedback.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackAnimation
