import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { cellPositions } from '../constants'

function WinnerLine({ line }) {
  const [start, , end] = line
  const startPos = cellPositions[start]
  const endPos = cellPositions[end]

  const progressRef = useRef(0)
  const [currentEnd, setCurrentEnd] = useState(startPos)

  useFrame((state, delta) => {
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 2, 1)
      const t = progressRef.current
      setCurrentEnd([
        startPos[0] + (endPos[0] - startPos[0]) * t,
        startPos[1] + (endPos[1] - startPos[1]) * t,
        startPos[2] + (endPos[2] - startPos[2]) * t,
      ])
    }
  })

  return <Line points={[startPos, currentEnd]} color="yellow" lineWidth={4} />
}

export default WinnerLine