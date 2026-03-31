import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { usePlank } from '../context/PlankContext'
import { useAI } from '../context/AIContext'
import { useData } from '../context/DataContext'

const PINK_HEIGHT = 0.3 // Match blue block height for chain positioning

const PinkBlock = ({ length = 4, width = 0.3, height = PINK_HEIGHT, position: initialPosition = [0, 0, 0] }) => {
  const [isSelected, setIsSelected] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [lastClickTime, setLastClickTime] = useState(0)
  const meshRef = useRef()
  const { gl } = useThree()
  const { plankPosition, isPlankInCenter, attachedSprings, isMass1Attached, setIsMass1Attached, setAttachedSprings, setIsMassAttached, springLengths, resetKey } = usePlank()
  const { logAction } = useAI()
  const { logEvent } = useData()
  const FLOOR_Y = -5
  const REST_LENGTH = 2.5

  useEffect(() => {
    if (resetKey > 0) {
      setPosition(initialPosition)
      setIsSelected(false)
      setIsMass1Attached(false)
      if (meshRef.current) {
        meshRef.current.position.set(initialPosition[0], FLOOR_Y + height / 2, initialPosition[2])
      }
    }
  }, [resetKey, initialPosition, height, setIsMass1Attached])

  // Attach to bottom of Spring 1: need plank suspended and Spring 1 attached
  const canAttachPink = isPlankInCenter && attachedSprings.length >= 1 && attachedSprings[0] === 'spring1'

  const handlePointerDown = useCallback((event) => {
    event.stopPropagation()
    const currentTime = Date.now()
    const timeSinceLastClick = currentTime - lastClickTime

    if (timeSinceLastClick < 300) {
      if (!isMass1Attached) {
        if (canAttachPink) {
          setIsMass1Attached(true)
          logAction('MASS1_ATTACHED', {})
          logEvent('MASS1_ATTACHED', {})
          setIsSelected(false)
          setLastClickTime(0)
          return
        }
        setIsSelected(false)
        setLastClickTime(0)
        return
      } else {
        setIsMass1Attached(false)
        setAttachedSprings(prev => prev.filter(id => id === 'spring1'))
        setIsMassAttached(false)
        logAction('MASS1_DETACHED', {})
        logEvent('MASS1_DETACHED', {})
        setIsSelected(false)
        setLastClickTime(0)
        return
      }
    }

    setLastClickTime(currentTime)
    if (!isSelected) {
      setIsSelected(true)
      logAction('PINK_BLOCK_SELECTED', {})
      logEvent('PINK_BLOCK_SELECTED', {})
      gl.domElement.style.cursor = 'pointer'
      return
    }
  }, [canAttachPink, isMass1Attached, setIsMass1Attached, setAttachedSprings, setIsMassAttached, gl, lastClickTime, isSelected, logAction, logEvent])

  useEffect(() => {
    gl.domElement.style.cursor = isSelected ? 'pointer' : 'default'
    return () => { gl.domElement.style.cursor = 'default' }
  }, [gl, isSelected])

  useFrame(() => {
    if (!meshRef.current) return
    if (isMass1Attached && attachedSprings.length >= 1) {
      const plankY = plankPosition[1]
      const plankHeight = 0.1
      const plankBottomY = plankY - plankHeight / 2
      const spring1Length = springLengths.spring1 ?? REST_LENGTH
      const spring1BottomY = plankBottomY - spring1Length
      const blockY = spring1BottomY - height / 2
      const blockX = plankPosition[0]
      const blockZ = plankPosition[2]
      meshRef.current.position.set(blockX, blockY, blockZ)
      if (Math.abs(position[0] - blockX) > 0.01 || Math.abs(position[1] - blockY) > 0.01 || Math.abs(position[2] - blockZ) > 0.01) {
        setPosition([blockX, blockY, blockZ])
      }
    } else {
      const targetX = initialPosition[0]
      const targetY = FLOOR_Y + height / 2
      const targetZ = initialPosition[2]
      const currentPos = meshRef.current.position
      if (Math.abs(currentPos.x - targetX) > 0.01 || Math.abs(currentPos.y - targetY) > 0.01 || Math.abs(currentPos.z - targetZ) > 0.01) {
        meshRef.current.position.set(targetX, targetY, targetZ)
        setPosition([targetX, targetY, targetZ])
      }
    }
  })

  const yPosition = isMass1Attached ? position[1] : FLOOR_Y + height / 2

  return (
    <mesh
      ref={meshRef}
      position={[position[0], yPosition, position[2]]}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      renderOrder={isMass1Attached ? 1 : 0}
    >
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial
        color={isSelected ? '#00ff00' : '#ec407a'}
        metalness={0.2}
        roughness={0.4}
        depthWrite={true}
      />
    </mesh>
  )
}

export default PinkBlock
