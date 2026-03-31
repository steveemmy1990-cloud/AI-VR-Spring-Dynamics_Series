import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlank } from '../context/PlankContext'
import { useAI } from '../context/AIContext'
import { useData } from '../context/DataContext'
import { useTooltip } from '../context/TooltipContext'
import { useFeedback } from '../context/FeedbackContext'
import { useLevel } from '../context/LevelContext'

const Plank = ({ length = 4, width = 0.3, height = 0.1, position: initialPosition = [0, 0, 0] }) => {
  const FLOOR_Y = -5
  // Initialize position: X and Z from props, Y always on floor initially
  const initialX = initialPosition[0] || 0
  const initialZ = initialPosition[2] || 0
  const initialY = FLOOR_Y + height / 2 // Always start on floor
  
  const [isSelected, setIsSelected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState([initialX, initialY, initialZ])
  const [dragStart, setDragStart] = useState(null)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isInCenter, setIsInCenter] = useState(false) // Track if plank is in center position
  const meshRef = useRef()
  const { gl, camera, raycaster } = useThree()
  const [dragMousePosition, setDragMousePosition] = useState({ x: 0, y: 0 })
  const { setPlankPosition, setIsPlankInCenter, resetKey, resetExperiment } = usePlank()
  const { logAction } = useAI()
  const { logEvent } = useData()
  const { showTooltip, hideTooltip, mousePosition } = useTooltip()
  const { showSuccess } = useFeedback()
  const { level } = useLevel()

  // Store original position for returning
  const originalPosition = useRef([initialX, initialY, initialZ])
  const centerPosition = [0, 6.5, 0] // Center position in space (raised for better spring attachment)
  
  // Reset internal state when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setPosition(originalPosition.current)
      setIsInCenter(false)
      setIsSelected(false)
      setIsDragging(false)
      setDragStart(null)
    }
  }, [resetKey])
  
  // Update context when position changes
  useEffect(() => {
    setPlankPosition(position)
    setIsPlankInCenter(isInCenter)
  }, [position, isInCenter, setPlankPosition, setIsPlankInCenter])
  
  // Create a plane for dragging (horizontal plane at the plank's Y position)
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  
  const handlePointerDown = useCallback((event) => {
    event.stopPropagation()
    
    const currentTime = Date.now()
    const timeSinceLastClick = currentTime - lastClickTime
    
    // Check for double click (within 300ms)
    if (timeSinceLastClick < 300) {
      // Double click: toggle between center position and original position
      if (isInCenter) {
        // Return plank to floor and reset all attached objects (springs, mass) to their initial positions
        resetExperiment()
        logAction('PLANK_UNSUSPENDED_RESET', { position: originalPosition.current })
        logEvent('PLANK_UNSUSPENDED_RESET', { position: originalPosition.current })
      } else {
        // Move to center of scene, suspended in space
        setPosition(centerPosition)
        setIsInCenter(true)
        logAction('PLANK_MOVED_TO_CENTER', { position: centerPosition })
        logEvent('PLANK_MOVED_TO_CENTER', { position: centerPosition })
        showSuccess('Plank is suspended and ready for springs!')
      }
      setIsSelected(false)
      setIsDragging(false)
      setDragStart(null)
      gl.domElement.style.cursor = 'default'
      setLastClickTime(0)
      return
    }
    
    setLastClickTime(currentTime)
    
    // If not selected, select it first
    if (!isSelected) {
      setIsSelected(true)
      logAction('PLANK_SELECTED', {})
      logEvent('PLANK_SELECTED', {})
      gl.domElement.style.cursor = 'pointer'
      showSuccess(level === 2 ? 'Plank selected.' : 'Plank selected. Double-click to suspend it!')
    }

    // Create a plane perpendicular to camera view direction for 3D movement
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    dragPlane.current.normal.copy(cameraDirection)
    dragPlane.current.constant = -cameraDirection.dot(
      new THREE.Vector3(position[0], position[1], position[2])
    )
    
    // Calculate initial intersection point on the plane using event coordinates
    const intersectionPoint = new THREE.Vector3()
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    raycaster.ray.intersectPlane(dragPlane.current, intersectionPoint)
    
    // When selected (green), immediately start dragging on click
    setIsDragging(true)
    setDragStart({
      intersectionPoint: intersectionPoint.clone(),
      initialPosition: [...position],
      mouseX: event.clientX,
      mouseY: event.clientY
    })
    setDragMousePosition({ x: event.clientX, y: event.clientY })
    gl.domElement.style.cursor = 'grabbing'
  }, [isSelected, isDragging, position, gl, camera, raycaster, lastClickTime, showSuccess, level])
  
  // Track mouse movement for plane-based dragging
  useEffect(() => {
    if (!isDragging) return
    
    const handleMouseMove = (event) => {
      if (!isSelected || !isDragging || !dragStart) return
      
      setDragMousePosition({ x: event.clientX, y: event.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isDragging, isSelected, dragStart])
  
  // Use useFrame for smooth 3D dragging with vertical movement
  useFrame(() => {
    if (!isSelected || !isDragging || !dragStart || !meshRef.current) return
    
    // Calculate mouse movement delta
    const mouseDeltaX = (dragMousePosition.x - dragStart.mouseX) / window.innerWidth
    const mouseDeltaY = -(dragMousePosition.y - dragStart.mouseY) / window.innerHeight
    
    // Get camera orientation vectors for movement
    const cameraRight = new THREE.Vector3()
    const cameraUp = new THREE.Vector3()
    const cameraForward = new THREE.Vector3()
    
    // Get camera's right, up, and forward vectors in world space
    cameraRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize()
    cameraUp.setFromMatrixColumn(camera.matrixWorld, 1).normalize()
    cameraForward.setFromMatrixColumn(camera.matrixWorld, 2).normalize()
    
    // Scale factor for movement sensitivity - adjust this to make movement feel right
    const moveScale = 8.0
    
    // Calculate movement: 
    // - Horizontal mouse movement moves along camera right vector
    // - Vertical mouse movement moves along camera up vector (for lifting)
    const moveVector = new THREE.Vector3()
    moveVector.addScaledVector(cameraRight, mouseDeltaX * moveScale)
    moveVector.addScaledVector(cameraUp, mouseDeltaY * moveScale)
    
    // Update position in all 3 dimensions - allows lifting into space
    const newPosition = [
      dragStart.initialPosition[0] + moveVector.x,
      dragStart.initialPosition[1] + moveVector.y, // Vertical movement enabled
      dragStart.initialPosition[2] + moveVector.z
    ]
    setPosition(newPosition)
  })
  
  const handlePointerMove = useCallback((event) => {
    // Movement is handled via mouse events for smoother updates
    event.stopPropagation()
  }, [])
  
  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    setDragStart(null)
    gl.domElement.style.cursor = isSelected ? 'pointer' : 'default'
  }, [gl, isSelected])
  
  // Set cursor style based on selection
  useEffect(() => {
    gl.domElement.style.cursor = isSelected ? 'pointer' : 'default'
    return () => {
      gl.domElement.style.cursor = 'default'
    }
  }, [gl, isSelected])
  
  // When selected, plank can be positioned anywhere in 3D space
  // When deselected, it maintains its current position (doesn't fall)
  return (
    <mesh 
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={(e) => {
        handlePointerUp(e)
        hideTooltip()
      }}
      onPointerEnter={(e) => {
        // Get mouse position from the event, fallback to global mouse position
        const nativeEvent = e.nativeEvent || e
        const x = nativeEvent.clientX ?? nativeEvent.pageX ?? mousePosition.x
        const y = nativeEvent.clientY ?? nativeEvent.pageY ?? mousePosition.y
        showTooltip('Plank', x, y)
      }}
    >
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial
        color={isSelected ? '#00ff00' : '#8B4513'}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  )
}

export default Plank
