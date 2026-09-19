import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'

function SphereMesh({ position, winning }) {
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

    if (materialRef.current) {
      if (winning) {
        materialRef.current.emissiveIntensity = Math.sin(state.clock.elapsedTime * 4) * 0.4 + 0.6
      } else {
        materialRef.current.emissiveIntensity =
          Math.sin(state.clock.elapsedTime * 1.5 + meshRef.current.rotation.y) * 0.15 + 0.2
      }
    }
  })

  return (
    <>
      <mesh ref={meshRef} position={position} scale={0} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color="dodgerblue"
          roughness={0.08}
          metalness={0.5}
          emissive={winning ? '#4499ff' : '#1e5fff'}
          emissiveIntensity={0}
        />
      </mesh>

      <Sparkles
        position={position}
        count={20}
        scale={0.9}
        size={2}
        speed={0.4}
        color={winning ? '#ffffff' : '#8be9ff'}
      />
    </>
  )
}

export default SphereMesh