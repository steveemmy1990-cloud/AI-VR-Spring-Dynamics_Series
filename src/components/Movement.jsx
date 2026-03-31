import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useData } from '../context/DataContext'

const Movement = () => {
  const { camera, gl } = useThree()
  const { logEvent } = useData()
  const keys = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't track keys if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }
      keys.current[e.code] = true
    }
    const handleKeyUp = (e) => {
      keys.current[e.code] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    // Check if user is typing in an input or textarea
    const activeElement = document.activeElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      return
    }

    const moveSpeed = 5 * delta
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()

    // Get camera's forward and right vectors
    camera.getWorldDirection(forward)
    forward.y = 0 // Keep movement on the ground plane
    forward.normalize()

    right.crossVectors(forward, camera.up).normalize()

    const moveVector = new THREE.Vector3(0, 0, 0)

    // W or ArrowUp
    if (keys.current['KeyW'] || keys.current['ArrowUp']) {
      moveVector.add(forward)
      logEvent('KEYBOARD_MOVEMENT', { direction: 'Forward' })
    }
    // S or ArrowDown
    if (keys.current['KeyS'] || keys.current['ArrowDown']) {
      moveVector.sub(forward)
      logEvent('KEYBOARD_MOVEMENT', { direction: 'Backward' })
    }
    // A or ArrowLeft
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
      moveVector.sub(right)
      logEvent('KEYBOARD_MOVEMENT', { direction: 'Left' })
    }
    // D or ArrowRight
    if (keys.current['KeyD'] || keys.current['ArrowRight']) {
      moveVector.add(right)
      logEvent('KEYBOARD_MOVEMENT', { direction: 'Right' })
    }

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(moveSpeed)
      camera.position.add(moveVector)
      
      // If we have OrbitControls, we need to update its target too
      // Search for OrbitControls in the scene
      const controls = state.get().controls
      if (controls && controls.target) {
        controls.target.add(moveVector)
      }
    }
  })

  return null
}

export default Movement
