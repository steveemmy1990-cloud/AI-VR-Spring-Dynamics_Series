import React from 'react'

const LabRoom = ({ level = 1 }) => {
  const roomSize = 42
  const roomFloorY = -5
  const roomCeilingY = 10
  const wallHeight = roomCeilingY - roomFloorY // 15
  const wallCenterY = (roomCeilingY + roomFloorY) / 2 // 2.5
  const isChallenge = level === 2

  // Level 1: indoor lab
  const floorColor = !isChallenge ? '#8B7355' : undefined
  const ceilingColor = !isChallenge ? '#E8E8E8' : undefined
  const wallColor = !isChallenge ? '#F5F5F5' : undefined

  // Level 2: Disney Pixar-style outdoor grass field with trees and car
  if (isChallenge) {
    const fieldSize = 40
    // Grass colors - vibrant Pixar greens
    const grassGreen = '#7cb342'
    const grassLight = '#9ccc65'
    const trunkBrown = '#6d4c41'
    const trunkLight = '#8d6e63'
    const foliageGreen = '#558b2f'
    const foliageLight = '#7cb342'
    const carBody = '#e53935'
    const carCabin = '#1e88e5'
    const wheelColor = '#37474f'

    return (
      <group>
        {/* Grass field - main ground plane */}
        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[fieldSize, fieldSize]} />
          <meshStandardMaterial
            color={grassGreen}
            roughness={0.9}
            metalness={0}
            emissive={grassLight}
            emissiveIntensity={0.08}
          />
        </mesh>

        {/* Trees - Pixar-style rounded trunks and canopies */}
        {/* Tree 1 - left back */}
        <group position={[-12, -5, -10]}>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.9, 5, 8]} />
            <meshStandardMaterial color={trunkBrown} roughness={0.85} />
          </mesh>
          <mesh position={[0, 5.5, 0]} castShadow>
            <sphereGeometry args={[3.2, 16, 16]} />
            <meshStandardMaterial color={foliageGreen} roughness={0.9} />
          </mesh>
        </group>
        {/* Tree 2 - right mid */}
        <group position={[11, -5, -6]}>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.7, 4, 8]} />
            <meshStandardMaterial color={trunkLight} roughness={0.85} />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshStandardMaterial color={foliageGreen} roughness={0.9} />
          </mesh>
        </group>
        {/* Tree 3 - left mid */}
        <group position={[-10, -5, 4]}>
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.65, 3.6, 8]} />
            <meshStandardMaterial color={trunkBrown} roughness={0.85} />
          </mesh>
          <mesh position={[0, 4, 0]} castShadow>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshStandardMaterial color={foliageLight} roughness={0.9} />
          </mesh>
        </group>
        {/* Tree 4 - right back */}
        <group position={[9, -5, -12]}>
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.75, 4.4, 8]} />
            <meshStandardMaterial color={trunkBrown} roughness={0.85} />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <sphereGeometry args={[2.8, 16, 16]} />
            <meshStandardMaterial color={foliageGreen} roughness={0.9} />
          </mesh>
        </group>
        {/* Tree 5 - far right */}
        <group position={[14, -5, 2]}>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.55, 3, 8]} />
            <meshStandardMaterial color={trunkLight} roughness={0.85} />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow>
            <sphereGeometry args={[1.8, 16, 16]} />
            <meshStandardMaterial color={foliageLight} roughness={0.9} />
          </mesh>
        </group>

        {/* Car - Pixar-style rounded, friendly */}
        <group position={[13, -4.95, 8]} rotation={[0, Math.PI / 2, 0]}>
          {/* Chassis body */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.5, 1.1]} />
            <meshStandardMaterial color={carBody} roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Cabin */}
          <mesh position={[0.2, 0.75, 0]} castShadow>
            <boxGeometry args={[1.2, 0.6, 1]} />
            <meshStandardMaterial color={carCabin} roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Wheels */}
          <mesh position={[-0.7, 0.15, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color={wheelColor} roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[-0.7, 0.15, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color={wheelColor} roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0.7, 0.15, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color={wheelColor} roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0.7, 0.15, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color={wheelColor} roughness={0.6} metalness={0.3} />
          </mesh>
        </group>
      </group>
    )
  }

  // Level 1: indoor lab room
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, roomFloorY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, roomCeilingY, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.6} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, wallCenterY, -roomSize / 2]} receiveShadow>
        <planeGeometry args={[roomSize, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, wallCenterY, roomSize / 2]} receiveShadow>
        <planeGeometry args={[roomSize, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-roomSize / 2, wallCenterY, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomSize, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[roomSize / 2, wallCenterY, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomSize, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Blackboard only in Level 1 (Guided) */}
      <group position={[0, 3, -roomSize / 2 + 0.01]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8, 4, 0.1]} />
          <meshStandardMaterial color="#654321" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[7.5, 3.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

export default LabRoom
