import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlank } from '../context/PlankContext'
import { useAI } from '../context/AIContext'
import { useData } from '../context/DataContext'
import { useTooltip } from '../context/TooltipContext'
import { useFeedback } from '../context/FeedbackContext'
import { useLevel } from '../context/LevelContext'

const PINK_BLOCK_HEIGHT = 0.3 // Level 2: first spring attaches below pink mass

const Spring = ({ initialGroupPosition = [0, 0, 0], springId }) => {
  const springRef = useRef()
  const groupRef = useRef()
  const [isSelected, setIsSelected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [springLength, setSpringLength] = useState(2.5)
  const [targetLength, setTargetLength] = useState(2.5)
  const [velocity, setVelocity] = useState(0) // For display/debugging
  const [isAttached, setIsAttached] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const lastClickTimeRef = useRef(0) // Use ref for immediate access in double-click detection
  const [rotation, setRotation] = useState([0, 0, Math.PI / 2]) // Horizontal rotation by default
  
  const FLOOR_Y = -5
  const SPRING_CENTER_Y = FLOOR_Y + 0.5
  // Calculate original position on floor - use useMemo to prevent recreation
  const originalFloorPosition = useMemo(() => 
    [initialGroupPosition[0], SPRING_CENTER_Y, initialGroupPosition[2]],
    [initialGroupPosition]
  )
  const [originalGroupPosition, setOriginalGroupPosition] = useState(originalFloorPosition)
  
  const { gl } = useThree()
  const { plankPosition, isPlankInCenter, attachedSprings, setAttachedSprings, isMassAttached, isMass1Attached, springLengths, setSpringLengths, springStiffness, massWeight, massWeight1, resetKey } = usePlank()
  const { level } = useLevel()
  const { logAction } = useAI()
  const { logEvent } = useData()
  const { showTooltip, hideTooltip, mousePosition } = useTooltip()
  const { showSuccess, showFailure } = useFeedback()
  
  // Spring physics constants - tuned for bouncy, responsive spring
  // Use dynamic stiffness from control panel (default to 2 N/m if not set)
  const SPRING_CONSTANT = springStiffness[springId] || 2.0 // k - stiffness (dynamic from control panel)
  const DAMPING = 0.15 // damping coefficient (reduced for more bouncy oscillation)
  const REST_LENGTH = 2.5 // natural length (reduced to fit scene)
  const MIN_LENGTH = 1
  const MAX_LENGTH = 5
  const MASS = 1.0 // Mass for physics calculations
  const BOUNCE_COEFFICIENT = 0.7 // Energy retention on bounce (higher = more bouncy)
  const DEMARCATOR_THICKNESS = 0.1 // Thickness of round demarcator plank between springs
  const DEMARCATOR_RADIUS = 0.6 // Radius of demarcator (slightly larger than spring radius)
  
  // Mass physics constants - use dynamic mass weight from control panel
  const GRAVITY = 9.8 // Gravity constant
  const MASS_BLOCK_WEIGHT = massWeight * GRAVITY // Total weight force (dynamic from control panel)
  
  // Spring physics simulation using useRef to avoid state update delays
  const physicsState = useRef({
    length: REST_LENGTH,
    velocity: 0
  })
  
  // Reset internal state when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setIsSelected(false)
      setIsDragging(false)
      setDragStart(null)
      setIsAttached(false)
      setRotation([0, 0, Math.PI / 2])
      setOriginalGroupPosition(originalFloorPosition)
      physicsState.current.length = REST_LENGTH
      physicsState.current.velocity = 0
      setSpringLength(REST_LENGTH)
      setLastClickTime(0)
      lastClickTimeRef.current = 0
      if (groupRef.current) {
        groupRef.current.position.set(originalFloorPosition[0], originalFloorPosition[1], originalFloorPosition[2])
        groupRef.current.rotation.set(0, 0, Math.PI / 2)
      }
    }
  }, [resetKey, originalFloorPosition])

  // When context attachedSprings no longer includes this spring (e.g. pink mass detached in Level 2), detach and return to floor
  useEffect(() => {
    if (isAttached && !attachedSprings.includes(springId) && groupRef.current) {
      setIsAttached(false)
      setRotation([0, 0, Math.PI / 2])
      setOriginalGroupPosition(originalFloorPosition)
      physicsState.current.length = REST_LENGTH
      physicsState.current.velocity = 0
      setSpringLength(REST_LENGTH)
      groupRef.current.position.set(originalFloorPosition[0], originalFloorPosition[1], originalFloorPosition[2])
      groupRef.current.rotation.set(0, 0, Math.PI / 2)
    }
  }, [attachedSprings, springId, isAttached, originalFloorPosition, REST_LENGTH])

  // Create high-fidelity spiral spring geometry with voxel-style rendering
  const springGeometry = useMemo(() => {
    const voxelSegments = 80 // Voxel-style discrete segments
    const turns = 4 // Reduced by one coil for better visibility in series
    const radius = 0.5
    const wireRadius = 0.12
    
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const normals = []
    const uvs = []
    const indices = []
    
    // Create spiral path with discrete voxel segments
    const spiralPoints = []
    for (let i = 0; i <= voxelSegments; i++) {
      const t = i / voxelSegments
      const angle = t * turns * Math.PI * 2
      const y = (t - 0.5) * REST_LENGTH
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      spiralPoints.push(new THREE.Vector3(x, y, z))
    }
    
    // Create tube around spiral with voxel-style faceted appearance
    const radialSegments = 8 // Lower for more voxel-like faceting
    let vertexIndex = 0
    
    for (let i = 0; i < voxelSegments; i++) {
      const p0 = spiralPoints[i]
      const p1 = spiralPoints[i + 1]
      const direction = new THREE.Vector3().subVectors(p1, p0).normalize()
      
      // Create perpendicular vectors for tube cross-section
      const up = new THREE.Vector3(0, 1, 0)
      let right = new THREE.Vector3().crossVectors(direction, up).normalize()
      if (right.length() < 0.1) {
        right.set(1, 0, 0)
      }
      const forward = new THREE.Vector3().crossVectors(right, direction).normalize()
      
      // Create faceted tube vertices (voxel-style)
      for (let j = 0; j <= radialSegments; j++) {
        const angle = (j / radialSegments) * Math.PI * 2
        const offset = new THREE.Vector3()
          .addScaledVector(right, Math.cos(angle) * wireRadius)
          .addScaledVector(forward, Math.sin(angle) * wireRadius)
        
        // Add vertices for both ends of segment
        positions.push(p0.x + offset.x, p0.y + offset.y, p0.z + offset.z)
        positions.push(p1.x + offset.x, p1.y + offset.y, p1.z + offset.z)
        
        const normal = offset.normalize()
        normals.push(normal.x, normal.y, normal.z)
        normals.push(normal.x, normal.y, normal.z)
        
        uvs.push(j / radialSegments, i / voxelSegments)
        uvs.push(j / radialSegments, (i + 1) / voxelSegments)
        
        // Create faces (quads as two triangles)
        if (i < voxelSegments && j < radialSegments) {
          const base = vertexIndex
          const nextJ = base + 2
          
          // First triangle
          indices.push(base, base + 1, nextJ)
          // Second triangle
          indices.push(base + 1, nextJ + 1, nextJ)
        }
        
        vertexIndex += 2
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    
    return geometry
  }, [])
  
  // Initialize physics state
  useEffect(() => {
    physicsState.current.length = REST_LENGTH
    physicsState.current.velocity = 0
  }, [])
  
  useFrame((state, delta) => {
    if (!springRef.current) return
    
    // Use fixed timestep for consistent physics
    const fixedDelta = Math.min(delta, 0.02) // Cap at 20ms for stability
    
    if (isDragging) {
      // Update target length based on drag
      const newLength = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, targetLength))
      physicsState.current.length = newLength
      physicsState.current.velocity = 0 // Reset velocity when dragging
      setSpringLength(newLength)
    } else {
      // Apply realistic spring physics (Hooke's law with damping)
      const currentLength = physicsState.current.length
      const currentVelocity = physicsState.current.velocity
      
      // Calculate displacement from rest position
      const displacement = currentLength - REST_LENGTH
      
      // Hooke's law: F = -kx (restoring force)
      // Use current stiffness from context (may have changed via control panel)
      const currentStiffness = springStiffness[springId] || 2.0
      const springForce = -currentStiffness * displacement
      
      // If mass is attached, add downward force (weight)
      // Level 2 arrangement: plank → S1 → Mass1 → S2 → Mass2. So S1 supports (m1+m2)g, S2 supports m2*g only.
      let massForce = 0
      if (isMassAttached && isAttached && attachedSprings.length > 0) {
        const springIndex = attachedSprings.indexOf(springId)
        if (level === 2 && isMass1Attached) {
          massForce = springIndex === 0
            ? (massWeight1 + massWeight) * GRAVITY  // Spring 1 supports both masses
            : massWeight * GRAVITY                  // Spring 2 supports only Mass 2
        } else {
          massForce = massWeight * GRAVITY
        }
      }
      
      // Damping force: F = -cv (proportional to velocity)
      const dampingForce = -DAMPING * currentVelocity
      
      // Net force: spring restoring force + mass weight + damping
      const netForce = springForce + massForce + dampingForce
      
      // F = ma, so a = F/m
      const acceleration = netForce / MASS
      
      // Update velocity: v = v0 + a*dt
      const newVelocity = currentVelocity + acceleration * fixedDelta
      
      // Update position: x = x0 + v*dt
      const newLength = currentLength + newVelocity * fixedDelta
      
      // Clamp to bounds and apply bounce if hitting limits
      let clampedLength = newLength
      let clampedVelocity = newVelocity
      
      if (newLength < MIN_LENGTH) {
        clampedLength = MIN_LENGTH
        clampedVelocity = -newVelocity * BOUNCE_COEFFICIENT // Bounce back with more energy
      } else if (newLength > MAX_LENGTH) {
        clampedLength = MAX_LENGTH
        clampedVelocity = -newVelocity * BOUNCE_COEFFICIENT // Bounce back with more energy
      }
      
      // Update physics state
      physicsState.current.length = clampedLength
      physicsState.current.velocity = clampedVelocity
      
      // Update React state for rendering
      setSpringLength(clampedLength)
      setVelocity(clampedVelocity)
    }
    
    // Update context with current spring length if attached (update every frame for smooth block following)
    if (isAttached && setSpringLengths && springRef.current) {
      const currentLength = physicsState.current.length
      // Update more frequently to ensure block follows smoothly
      setSpringLengths(prev => {
        const prevLength = prev[springId]
        // Update if length changed (smaller threshold for smoother updates)
        if (prevLength === undefined || Math.abs(prevLength - currentLength) > 0.001) {
          return { ...prev, [springId]: currentLength }
        }
        return prev
      })
    }
    
    // Update spring geometry scale and position
    const scale = physicsState.current.length / REST_LENGTH
    springRef.current.scale.y = scale // Scale along Y-axis (spring's natural axis)
    springRef.current.scale.x = 1 // Keep X scale at 1
    springRef.current.scale.z = 1 // Keep Z scale at 1
    
    // Position spring based on attachment state
    if (isAttached) {
      // In series arrangement, calculate position based on position in chain
      const springIndex = attachedSprings.indexOf(springId)
      if (springIndex >= 0 && groupRef.current) {
        const plankY = plankPosition[1]
        const plankHeight = 0.1
        const plankBottomY = plankY - plankHeight / 2
        
        let springTopY
        if (springIndex === 0) {
          // First spring: top at plank bottom
          springTopY = plankBottomY
        } else {
          // Second spring: in Level 2, top is at pink mass bottom (below Spring 1). In Level 1, below Spring 1 + demarcator.
          if (level === 2 && isMass1Attached) {
            const spring1Len = springLengths[attachedSprings[0]] ?? REST_LENGTH
            springTopY = plankBottomY - spring1Len - PINK_BLOCK_HEIGHT
          } else {
            let cumulativeLength = 0
            for (let i = 0; i < springIndex; i++) {
              const prevId = attachedSprings[i]
              const prevLength = springLengths[prevId]
              cumulativeLength += (prevLength !== undefined && prevLength > 0) ? prevLength : REST_LENGTH
              cumulativeLength += DEMARCATOR_THICKNESS
            }
            springTopY = plankBottomY - cumulativeLength
          }
        }
        
        // Spring geometry extends from -REST_LENGTH/2 to +REST_LENGTH/2 along Y
        // After scaling, it extends from -REST_LENGTH/2*scale to +REST_LENGTH/2*scale
        // To fix top at springTopY: group position.y + REST_LENGTH/2*scale = springTopY
        // So: group position.y = springTopY - REST_LENGTH/2*scale
        const springCenterY = springTopY - (REST_LENGTH / 2) * scale
        
        // Update group position (spring mesh is at [0,0,0] relative to group)
        groupRef.current.position.x = plankPosition[0]
        groupRef.current.position.z = plankPosition[2]
        groupRef.current.position.y = springCenterY
        
        // Spring mesh position relative to group stays at [0,0,0]
        springRef.current.position.set(0, 0, 0)
      } else {
        // Fallback: original vertical attachment logic
        const fixedTopY = REST_LENGTH / 2
        springRef.current.position.y = fixedTopY * (1 - scale)
      }
    } else {
      // When horizontal on floor, fix left side
      // Original spring extends from -REST_LENGTH/2 to +REST_LENGTH/2 along Y
      // After rotation 90°, Y becomes horizontal (left-right)
      // To fix left side: position.y = -REST_LENGTH/2 + (REST_LENGTH/2 * scale)
      const fixedLeftY = -REST_LENGTH / 2
      springRef.current.position.y = fixedLeftY * (1 - scale)
    }
  })
  
  // Mouse interaction handlers
  const handlePointerDown = useCallback((event) => {
    event.stopPropagation()
    
    const currentTime = Date.now()
    const timeSinceLastClick = currentTime - lastClickTimeRef.current
    
    // Check for double click (within 300ms) - must have a previous click recorded
    if (timeSinceLastClick < 300 && lastClickTimeRef.current > 0) {
      // Double click: attach to plank if plank is in center
      console.log('Double-click detected on spring:', springId, {
        isPlankInCenter,
        isAttached,
        attachedSprings: attachedSprings.length,
        canAttach: isPlankInCenter && !isAttached
      })
      const canAttach = isPlankInCenter && (springId !== 'spring2' || level !== 2 || isMass1Attached)
      if (canAttach && !isAttached) {
        console.log('Attempting to attach spring:', springId, 'Current attached springs:', attachedSprings)
        
        // Attach spring in series arrangement - springs connect end-to-end vertically
        const plankY = plankPosition[1]
        const plankHeight = 0.1
        const plankBottomY = plankY - plankHeight / 2
        
        // First, update the attachedSprings array to ensure correct order
        // Spring 1 should always be first (index 0), Spring 2 should be second (index 1)
        let newAttachedSprings = attachedSprings.filter(id => id !== springId) // Remove if already exists
        if (springId === 'spring1') {
          newAttachedSprings.unshift(springId) // Add spring1 at the beginning
        } else if (springId === 'spring2') {
          // Spring 2 goes after Spring 1
          // If Spring 1 is already attached, add Spring 2 after it
          // If Spring 1 is not attached, Spring 2 should still be able to attach (it will be first temporarily)
          const spring1Index = newAttachedSprings.indexOf('spring1')
          if (spring1Index >= 0) {
            // Spring 1 exists, insert Spring 2 right after it
            newAttachedSprings.splice(spring1Index + 1, 0, springId)
          } else {
            // Spring 1 not attached yet, Spring 2 can still attach (will be repositioned when Spring 1 attaches)
            newAttachedSprings.push(springId)
          }
        } else {
          newAttachedSprings.push(springId) // Add other springs at the end
        }
        
        // Calculate position based on position in series chain
        const springIndex = newAttachedSprings.indexOf(springId)
        console.log('Spring index in chain:', springIndex, 'for spring:', springId)
        
        // First spring attaches directly to plank
        // Subsequent springs attach to the bottom of the previous spring
        let springTopY
        if (springIndex === 0) {
          springTopY = plankBottomY
        } else {
          if (level === 2 && isMass1Attached) {
            const spring1Len = springLengths[newAttachedSprings[0]] ?? REST_LENGTH
            springTopY = plankBottomY - spring1Len - PINK_BLOCK_HEIGHT
          } else {
            let cumulativeLength = 0
            for (let i = 0; i < springIndex; i++) {
              const prevId = newAttachedSprings[i]
              const prevLength = springLengths[prevId]
              cumulativeLength += (prevLength !== undefined && prevLength > 0) ? prevLength : REST_LENGTH
              cumulativeLength += DEMARCATOR_THICKNESS
            }
            springTopY = plankBottomY - cumulativeLength
          }
        }

        // Spring center is REST_LENGTH/2 below the top
        const springCenterY = springTopY - REST_LENGTH / 2
        
        // All springs in series are centered horizontally on the plank
        const attachedPosition = [
          plankPosition[0], // X position (centered on plank)
          springCenterY,   // Y position (vertical, in chain)
          plankPosition[2]  // Z position (same as plank)
        ]
        
        console.log('Calculated position for spring:', springId, attachedPosition, 'springTopY:', springTopY)
        
        if (groupRef.current) {
          groupRef.current.position.set(attachedPosition[0], attachedPosition[1], attachedPosition[2])
          // No Z rotation: spring stands vertically (extends along Y, top at plank)
          groupRef.current.rotation.set(0, 0, 0)
        }
        setOriginalGroupPosition(attachedPosition)
        setRotation([0, 0, 0]) // Standing: vertical, not flat
        setIsAttached(true)
        setAttachedSprings(newAttachedSprings)
        console.log('Spring attached successfully:', springId, 'New attached springs:', newAttachedSprings)
        logAction('SPRING_ATTACHED', { springId, position: attachedPosition, totalAttached: attachedSprings.length + 1 })
        logEvent('SPRING_ATTACHED', { springId, position: attachedPosition, totalAttached: attachedSprings.length + 1 })
        const springNum = springId === 'spring1' ? '1' : '2'
        const next = springId === 'spring1' ? 'Now attach Spring 2!' : 'Now attach the mass!'
        showSuccess(`Spring ${springNum} attached! ${next}`)
      } else if (isAttached) {
        // Detach: return to floor, flat again
        if (groupRef.current) {
          groupRef.current.position.set(originalFloorPosition[0], originalFloorPosition[1], originalFloorPosition[2])
          groupRef.current.rotation.set(0, 0, Math.PI / 2) // Flat on floor
        }
        setOriginalGroupPosition(originalFloorPosition)
        setRotation([0, 0, Math.PI / 2])
        setIsAttached(false)
        setAttachedSprings(attachedSprings.filter(id => id !== springId))
        logAction('SPRING_DETACHED', { springId, totalAttached: attachedSprings.length - 1 })
        logEvent('SPRING_DETACHED', { springId, totalAttached: attachedSprings.length - 1 })
      } else {
        console.log('Cannot attach spring:', springId, {
          reason: !canAttach ? 'plank not in center or (Level 2 Spring 2: pink mass not attached)' : 'spring already attached',
          isPlankInCenter,
          isAttached
        })
        if (!isPlankInCenter) {
          showFailure(level === 2 ? 'Suspend the plank first.' : 'Suspend the plank first by double-clicking it.')
        } else if (level === 2 && !isMass1Attached && springId === 'spring2') {
          showFailure('In Level 2, attach Spring 1, then the pink mass (Mass 1), then attach Spring 2.')
        }
      }
      setIsSelected(false)
      setLastClickTime(0)
      lastClickTimeRef.current = 0
      return
    }
    
    // Store click time for double-click detection (use ref for immediate access)
    setLastClickTime(currentTime)
    lastClickTimeRef.current = currentTime
    
    // First click: select the spring (turn green) if not already selected
    if (!isSelected) {
      console.log('First click - selecting spring:', springId, {
        isPlankInCenter,
        isAttached,
        attachedSprings: attachedSprings.length,
        lastClickTime
      })
      setIsSelected(true)
      logAction('SPRING_SELECTED', { springId })
      logEvent('SPRING_SELECTED', { springId })
      gl.domElement.style.cursor = 'pointer'
      // Don't return here - allow the click time to be set for double-click detection
      return
    }
    
    console.log('Second click on selected spring:', springId, 'Starting drag')
    
    // Second click (when selected and not attaching): start dragging
    setIsDragging(true)
    setDragStart({
      x: event.point.x, // Use X for horizontal dragging
      initialLength: physicsState.current.length
    })
    // Stop any existing motion when starting to drag
    physicsState.current.velocity = 0
    setVelocity(0)
    // Enable pointer lock for smooth dragging
    gl.domElement.style.cursor = 'grabbing'
  }, [isSelected, isPlankInCenter, isAttached, isMass1Attached, level, plankPosition, attachedSprings, springId, setAttachedSprings, originalGroupPosition, gl, lastClickTime, logAction, logEvent, originalFloorPosition, REST_LENGTH, showFailure])
  
  const handlePointerMove = useCallback((event) => {
    // Only allow dragging if selected
    if (!isSelected || !isDragging || !dragStart) return
    
    event.stopPropagation()
    // For horizontal spring, use X-axis movement instead of Y-axis
    const deltaX = (event.point.x - dragStart.x) * 2 // Scale factor for sensitivity
    const newLength = dragStart.initialLength + deltaX
    const clampedLength = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, newLength))
    setTargetLength(clampedLength)
    setSpringLength(clampedLength)
    // Update physics state directly when dragging
    physicsState.current.length = clampedLength
    physicsState.current.velocity = 0 // Reset velocity when dragging
    setVelocity(0) // Reset velocity when dragging
  }, [isSelected, isDragging, dragStart])
  
  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    setDragStart(null)
    gl.domElement.style.cursor = isSelected ? 'pointer' : 'default'
    // When released, the spring will naturally bounce back due to physics
    // The velocity is already set to 0 during dragging, so it will start from rest
    // and accelerate toward REST_LENGTH
  }, [gl, isSelected])
  
  // Set cursor style based on selection
  useEffect(() => {
    gl.domElement.style.cursor = isSelected ? 'pointer' : 'default'
    return () => {
      gl.domElement.style.cursor = 'default'
    }
  }, [gl, isSelected])
  
  // Material color based on selection state
  const materialColor = isSelected ? '#00ff00' : '#00d4ff'
  const materialEmissive = isSelected ? '#002200' : '#002244'
  const materialEmissiveIntensity = isSelected ? 0.5 : 0.3
  
  return (
    <group 
      ref={groupRef}
      position={originalGroupPosition}
      rotation={rotation} // Horizontal when on floor, vertical when attached
    >
      {/* Main spring mesh */}
      <mesh
        ref={springRef}
        geometry={springGeometry}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
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
          showTooltip(`Spring ${springId === 'spring1' ? '1' : '2'}`, x, y)
        }}
        renderOrder={0}
      >
        <meshStandardMaterial
          color={materialColor}
          metalness={0.95}
          roughness={0.05}
          emissive={materialEmissive}
          emissiveIntensity={materialEmissiveIntensity}
          envMapIntensity={2.0}
          flatShading={false}
        />
      </mesh>
      
      {/* Visual indicator when dragging */}
      {isDragging && (
        <mesh position={[-REST_LENGTH / 2 + springLength + 0.5, 0, 0]}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Demarcator plank - appears at bottom of spring when attached (except for last spring) */}
      {isAttached && attachedSprings.length > 0 && (() => {
        const springIndex = attachedSprings.indexOf(springId)
        const isLastSpring = springIndex === attachedSprings.length - 1
        // Only show demarcator if not the last spring in the chain
        if (!isLastSpring) {
          // Position demarcator at bottom of spring
          // Spring extends from -REST_LENGTH/2*scale to +REST_LENGTH/2*scale
          // Bottom is at -REST_LENGTH/2*scale
          // Demarcator center should be at bottom - DEMARCATOR_THICKNESS/2
          // Use springLength state to ensure it updates dynamically
          const currentScale = springLength / REST_LENGTH
          const springBottomY = -REST_LENGTH / 2 * currentScale
          const demarcatorY = springBottomY - DEMARCATOR_THICKNESS / 2
          
          return (
            <mesh 
              position={[0, demarcatorY, 0]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[DEMARCATOR_RADIUS, DEMARCATOR_RADIUS, DEMARCATOR_THICKNESS, 32]} />
              <meshStandardMaterial
                color="#8B4513"
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
          )
        }
        return null
      })()}
    </group>
  )
}

export default Spring
