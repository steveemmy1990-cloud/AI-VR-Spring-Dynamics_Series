import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { usePlank } from '../context/PlankContext'
import { useAI } from '../context/AIContext'
import { useData } from '../context/DataContext'
import { useTooltip } from '../context/TooltipContext'
import { useFeedback } from '../context/FeedbackContext'
import { useLevel } from '../context/LevelContext'

const PINK_BLOCK_HEIGHT = 0.3 // Level 2: chain starts below pink mass

const Block = ({ length = 4, width = 0.3, height = 0.3, position: initialPosition = [0, 0, 0] }) => {
  const [isSelected, setIsSelected] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [lastClickTime, setLastClickTime] = useState(0)
  const meshRef = useRef()
  const { gl } = useThree()
  const { plankPosition, isPlankInCenter, attachedSprings, isMassAttached, isMass1Attached, setIsMassAttached, springLengths, resetKey, showWarning } = usePlank()
  const { level } = useLevel()
  const { logAction } = useAI()
  const { logEvent } = useData()
  const { showTooltip, hideTooltip, mousePosition } = useTooltip()
  const { showSuccess, showFailure } = useFeedback()
  const FLOOR_Y = -5
  const REST_LENGTH = 2.5 // Match spring rest length
  
  // Reset internal state when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setPosition(initialPosition)
      setIsSelected(false)
      setIsMassAttached(false)
      if (meshRef.current) {
        meshRef.current.position.set(initialPosition[0], FLOOR_Y + height / 2, initialPosition[2])
      }
    }
  }, [resetKey, initialPosition, height])
  
  const handlePointerDown = useCallback((event) => {
    event.stopPropagation()
    
    const currentTime = Date.now()
    const timeSinceLastClick = currentTime - lastClickTime
    
    // Check for double click (within 300ms)
    if (timeSinceLastClick < 300) {
      // Double click: attach/detach mass to springs
      if (!isMassAttached) {
        // Try to attach - check conditions
        // For series spring arrangement, minimum 2 springs required
        if (isPlankInCenter && attachedSprings.length >= 2) {
          console.log('Double-click detected: Attaching mass', { 
            isPlankInCenter, 
            attachedSpringsCount: attachedSprings.length 
          })
          setIsMassAttached(true)
          logAction('MASS_ATTACHED', { attachedSpringsCount: attachedSprings.length })
          logEvent('MASS_ATTACHED', { attachedSpringsCount: attachedSprings.length })
          showSuccess('Mass attached! Adjust settings and take a reading.')
          setIsSelected(false)
          setLastClickTime(0)
          return
        } else {
          // Show warning message popup (Level 2: no double-click hint—user learned that in Level 1)
          let message = ''
          if (!isPlankInCenter) {
            message = level === 2 ? 'Please suspend the plank first.' : 'Please suspend the plank first by double-clicking it.'
          } else if (attachedSprings.length < 2) {
            message = `For a series arrangement, you need at least 2 springs attached. Currently you have ${attachedSprings.length} spring(s). Please attach ${2 - attachedSprings.length} more spring(s).`
          }
          
          console.log('Cannot attach: conditions not met', { 
            isPlankInCenter, 
            attachedSpringsCount: attachedSprings.length,
            message
          })
          
          // Show popup warning using UI overlay
          showWarning(message)
          if (attachedSprings.length < 2) {
            showFailure('Attach at least 2 springs before adding the mass.')
          } else if (!isPlankInCenter) {
            showFailure('Suspend the plank first.')
          }
          
          // Log failed attempt
          logAction('MASS_ATTACH_FAILED', { 
            reason: attachedSprings.length < 2 ? 'not_enough_springs' : 'plank_not_centered',
            attachedSpringsCount: attachedSprings.length 
          })
          logEvent('MASS_ATTACH_FAILED', { 
            reason: attachedSprings.length < 2 ? 'not_enough_springs' : 'plank_not_centered',
            attachedSpringsCount: attachedSprings.length
          })
          setIsSelected(false)
          setLastClickTime(0)
          return
        }
      } else {
        // Detach mass
        console.log('Double-click detected: Detaching mass')
        setIsMassAttached(false)
        logAction('MASS_DETACHED', {})
        logEvent('MASS_DETACHED', {})
        setIsSelected(false)
        setLastClickTime(0)
        return
      }
    }
    
    setLastClickTime(currentTime)
    
    // First click: select the block (turn green)
    if (!isSelected) {
      setIsSelected(true)
      logAction('BLOCK_SELECTED', {})
      logEvent('BLOCK_SELECTED', {})
      gl.domElement.style.cursor = 'pointer'
      return
    }
  }, [isPlankInCenter, attachedSprings, isMassAttached, setIsMassAttached, gl, lastClickTime, isSelected])
  
  // Set cursor style based on selection
  useEffect(() => {
    gl.domElement.style.cursor = isSelected ? 'pointer' : 'default'
    return () => {
      gl.domElement.style.cursor = 'default'
    }
  }, [gl, isSelected])
  
  // Automatically detach block when all springs are detached
  useEffect(() => {
    if (isMassAttached && attachedSprings.length === 0) {
      console.log('All springs detached: automatically detaching block')
      setIsMassAttached(false)
      setIsSelected(false)
    }
  }, [isMassAttached, attachedSprings.length, setIsMassAttached])
  
  // Update block position when mass is attached to springs
  useFrame(() => {
    if (!meshRef.current) return
    
    if (isMassAttached && attachedSprings.length > 0 && Object.keys(springLengths).length > 0) {
      const plankY = plankPosition[1]
      const plankHeight = 0.1
      const plankBottomY = plankY - plankHeight / 2
      const REST_LENGTH = 2.5
      const DEMARCATOR_THICKNESS = 0.1

      let totalChainLength
      if (level === 2 && isMass1Attached) {
        // Level 2: plank → S1 → Mass1 (pink) → S2 → Mass2 (blue). No demarcator between S1 and pink or pink and S2.
        const L1 = springLengths.spring1 ?? REST_LENGTH
        const L2 = springLengths.spring2 ?? REST_LENGTH
        totalChainLength = L1 + PINK_BLOCK_HEIGHT + L2
      } else {
        let total = 0
        for (let i = 0; i < attachedSprings.length; i++) {
          const springId = attachedSprings[i]
          total += (springLengths[springId] ?? REST_LENGTH)
          if (i < attachedSprings.length - 1) total += DEMARCATOR_THICKNESS
        }
        totalChainLength = total
      }

      const springBottomY = plankBottomY - totalChainLength
      
      // Position block so its top surface touches spring bottom exactly
      // Block center Y = spring bottom - half block height
      // This ensures no gap between block top and spring bottom
      const blockY = springBottomY - height / 2
      
      // Center block horizontally on plank
      const blockX = plankPosition[0]
      const blockZ = plankPosition[2]
      
      // Update position every frame to ensure tight connection (smooth following)
      meshRef.current.position.set(blockX, blockY, blockZ)
      // Only update React state if changed significantly to avoid excessive re-renders
      const currentPos = meshRef.current.position
      if (Math.abs(position[0] - blockX) > 0.01 || 
          Math.abs(position[1] - blockY) > 0.01 || 
          Math.abs(position[2] - blockZ) > 0.01) {
        setPosition([blockX, blockY, blockZ])
      }
    } else if (!isMassAttached) {
      // Return to original position when not attached
      const targetX = initialPosition[0]
      const targetY = FLOOR_Y + height / 2
      const targetZ = initialPosition[2]
      const currentPos = meshRef.current.position
      if (Math.abs(currentPos.x - targetX) > 0.01 || 
          Math.abs(currentPos.y - targetY) > 0.01 || 
          Math.abs(currentPos.z - targetZ) > 0.01) {
        meshRef.current.position.set(targetX, targetY, targetZ)
        setPosition([targetX, targetY, targetZ])
      }
    }
  })
  
  // Calculate Y position - on floor when not attached, at spring bottom when attached
  const yPosition = isMassAttached 
    ? position[1] 
    : FLOOR_Y + height / 2
  
  return (
    <mesh 
      ref={meshRef}
      position={[position[0], yPosition, position[2]]}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerEnter={(e) => {
        // Get mouse position from the event, fallback to global mouse position
        const nativeEvent = e.nativeEvent || e
        const x = nativeEvent.clientX ?? nativeEvent.pageX ?? mousePosition.x
        const y = nativeEvent.clientY ?? nativeEvent.pageY ?? mousePosition.y
        showTooltip('Mass', x, y)
      }}
      onPointerLeave={() => hideTooltip()}
      renderOrder={isMassAttached ? 1 : 0}
    >
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial
        color={isSelected ? '#00ff00' : '#0066ff'}
        metalness={0.2}
        roughness={0.4}
        depthWrite={true}
      />
    </mesh>
  )
}

export default Block
