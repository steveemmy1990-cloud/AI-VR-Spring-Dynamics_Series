import React from 'react'
import './VideoModal.css'

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>×</button>
        <div className="video-modal-header">
          <h2>Tutorial Video</h2>
          <p>Watch this video to learn about the spring series arrangement experiment</p>
        </div>
        <div className="video-modal-player">
          <iframe
            src={videoUrl}
            title="Tutorial Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default VideoModal
