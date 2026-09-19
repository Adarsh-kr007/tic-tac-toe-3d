import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function CubeMesh({ position, winning }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const scaleRef = useRef(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (scaleRef.current < 1) {
      scaleRef.current = Math.min(scaleRef.current + delta * 6, 1)
      meshRef.current.scale.setScalar(scaleRef.current)
    }

    meshRef.current.rotation.x += delta * 0.8
    meshRef.current.rotation.y += delta * 1.1
    meshRef.current.rotation.z += delta * 0.5

    if (winning && materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.4 + 0.6
      materialRef.current.emissiveIntensity = pulse
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={0} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        ref={materialRef}
        color="tomato"
        roughness={0.08}
        metalness={0.5}
        emissive={winning ? '#ff4444' : '#000000'}
        emissiveIntensity={0}
      />
    </mesh>
  )
}

export default CubeMesh