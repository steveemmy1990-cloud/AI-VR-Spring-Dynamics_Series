import React, { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAI } from '../context/AIContext'
import { useData } from '../context/DataContext'
import { useTooltip } from '../context/TooltipContext'

const Robot = ({ position = [-6, -1.5, 0] }) => {
  const groupRef = useRef()
  const eyeRef1 = useRef()
  const eyeRef2 = useRef()
  const { gl } = useThree()
  const { isRobotActive, setIsRobotActive, logAction, clearConversation } = useAI()
  const { logEvent } = useData()
  const { showTooltip, hideTooltip, mousePosition } = useTooltip()
  const [isHovered, setIsHovered] = useState(false)
  
  // Subtle idle animation - slight breathing/swaying
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle up and down movement (breathing effect)
      const baseY = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      // More animated when active
      const extraBob = isRobotActive ? Math.sin(state.clock.elapsedTime * 1.5) * 0.03 : 0
      groupRef.current.position.y = baseY + extraBob
    }
    
    // Eye glow animation - more intense when active
    if (eyeRef1.current && eyeRef2.current) {
      const baseIntensity = isRobotActive ? 1.2 : 0.8
      const intensity = baseIntensity + Math.sin(state.clock.elapsedTime * 2) * 0.2
      eyeRef1.current.intensity = intensity
      eyeRef2.current.intensity = intensity
    }
  })
  
  // Handle robot activation
  const handleClick = useCallback((event) => {
    event.stopPropagation()
    const newState = !isRobotActive
    setIsRobotActive(newState)
    logAction('ROBOT_ACTIVATION', { active: newState })
    logEvent('ROBOT_CLICKED', { active: newState })
    
    if (newState) {
      clearConversation()
      console.log('AI Robot activated!')
    } else {
      console.log('AI Robot deactivated')
    }
  }, [isRobotActive, setIsRobotActive, logAction, logEvent, clearConversation])
  
  const handlePointerOver = useCallback((event) => {
    event.stopPropagation()
    setIsHovered(true)
    gl.domElement.style.cursor = 'pointer'
    // Get mouse position from the event, fallback to global mouse position
    const nativeEvent = event.nativeEvent || event
    const x = nativeEvent.clientX ?? nativeEvent.pageX ?? mousePosition.x
    const y = nativeEvent.clientY ?? nativeEvent.pageY ?? mousePosition.y
    showTooltip('AI Robot', x, y)
  }, [gl, showTooltip, mousePosition])
  
  const handlePointerOut = useCallback((event) => {
    event.stopPropagation()
    setIsHovered(false)
    gl.domElement.style.cursor = 'default'
    hideTooltip()
  }, [gl, hideTooltip])
  
  // Colors - change when active
  const whiteColor = isRobotActive ? '#4499ff' : '#ffffff' // Blue when active
  const tealColor = '#00d4aa' // Teal/turquoise accent color
  const glowIntensity = isRobotActive ? 0.5 : 0
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Head - Large spherical */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color={whiteColor} 
          metalness={0.3}
          roughness={0.2}
          emissive={whiteColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      
      {/* Visor - Dark visor across upper face */}
      <mesh position={[0, 2.35, 0.31]} castShadow>
        <boxGeometry args={[1.0, 0.4, 0.05]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      
      {/* Left Eye - Glowing teal */}
      <pointLight 
        ref={eyeRef1}
        position={[-0.2, 2.35, 0.32]} 
        color={tealColor}
        intensity={0.8}
        distance={2}
      />
      <mesh position={[-0.2, 2.35, 0.32]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color={tealColor} 
          emissive={tealColor}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Right Eye - Glowing teal */}
      <pointLight 
        ref={eyeRef2}
        position={[0.2, 2.35, 0.32]} 
        color={tealColor}
        intensity={0.8}
        distance={2}
      />
      <mesh position={[0.2, 2.35, 0.32]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color={tealColor} 
          emissive={tealColor}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Side components (ears/communication modules) */}
      <mesh position={[-0.55, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      <mesh position={[0.55, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Mouth line */}
      <mesh position={[0, 2.05, 0.31]} castShadow>
        <boxGeometry args={[0.3, 0.02, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Torso - Rounded white body */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.8, 1.0, 0.6]} />
        <meshStandardMaterial 
          color={whiteColor} 
          metalness={0.3}
          roughness={0.2}
          emissive={whiteColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      
      {/* Chest panel - Teal with symbol */}
      <mesh position={[0, 1.3, 0.31]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Chest symbol - White rectangular symbol (battery/8 shape) */}
      <mesh position={[0, 1.3, 0.33]}>
        <boxGeometry args={[0.15, 0.25, 0.02]} />
        <meshStandardMaterial color={whiteColor} />
      </mesh>
      <mesh position={[0, 1.3, 0.33]}>
        <boxGeometry args={[0.05, 0.25, 0.02]} />
        <meshStandardMaterial color={whiteColor} />
      </mesh>
      
      {/* Left Arm - Upper arm */}
      <mesh position={[-0.6, 1.5, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Left Elbow Joint - Teal */}
      <mesh position={[-0.75, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Left Forearm */}
      <mesh position={[-0.9, 0.9, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Left Hand - Rounded with fingers */}
      <mesh position={[-1.05, 0.65, 0]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Right Arm - Upper arm */}
      <mesh position={[0.6, 1.5, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Right Elbow Joint - Teal */}
      <mesh position={[0.75, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Right Forearm */}
      <mesh position={[0.9, 0.9, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Right Hand - Rounded with fingers */}
      <mesh position={[1.05, 0.65, 0]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Left Leg - Upper thigh */}
      <mesh position={[-0.25, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Left Knee Joint - Teal */}
      <mesh position={[-0.25, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Left Lower Leg */}
      <mesh position={[-0.25, -0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Left Foot - Broad and flat */}
      <mesh position={[-0.25, -0.65, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.35]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Left Foot Teal Trim */}
      <mesh position={[-0.25, -0.65, 0.1]} castShadow>
        <boxGeometry args={[0.27, 0.05, 0.37]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Right Leg - Upper thigh */}
      <mesh position={[0.25, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Right Knee Joint - Teal */}
      <mesh position={[0.25, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
      
      {/* Right Lower Leg */}
      <mesh position={[0.25, -0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Right Foot - Broad and flat */}
      <mesh position={[0.25, -0.65, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.35]} />
        <meshStandardMaterial color={whiteColor} emissive={whiteColor} emissiveIntensity={glowIntensity} />
      </mesh>
      
      {/* Right Foot Teal Trim */}
      <mesh position={[0.25, -0.65, 0.1]} castShadow>
        <boxGeometry args={[0.27, 0.05, 0.37]} />
        <meshStandardMaterial color={tealColor} />
      </mesh>
    </group>
  )
}

export default Robot
