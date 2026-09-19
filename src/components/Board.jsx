import { useState } from 'react'
import SphereMesh from './SphereMesh'
import CubeMesh from './CubeMesh'
import WinnerLine from './WinnerLine'
import { cellPositions } from '../constants'

function Board({ cells, onCellClick, winnerLine, isXTurn, gameOver }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <>
      {cellPositions.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => onCellClick(index)}
          onPointerOver={(e) => {
          e.stopPropagation()
          if (!cells[index] && !gameOver) {
          setHoveredIndex(index)
          document.body.style.cursor = 'pointer'
          }
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredIndex(null)
            document.body.style.cursor = 'auto'
          }}
        >
          <planeGeometry args={[0.9, 0.9]} />
          <meshStandardMaterial color="white" transparent opacity={0} />
        </mesh>
      ))}

      {cells.map((value, index) => {
      if (!value) return null
      const pos = cellPositions[index]
      const isWinning = winnerLine ? winnerLine.includes(index) : false
      return value === 'X' ? (
      <CubeMesh key={index} position={pos} winning={isWinning} />
      ) : (
      <SphereMesh key={index} position={pos} winning={isWinning} />
     )
     })}

      {winnerLine && <WinnerLine line={winnerLine} />}

      {hoveredIndex !== null && !cells[hoveredIndex] && !gameOver && (
        isXTurn ? (
          <mesh position={cellPositions[hoveredIndex]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color="tomato"
              transparent
              opacity={0.35}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
        ) : (
          <mesh position={cellPositions[hoveredIndex]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial
              color="dodgerblue"
              transparent
              opacity={0.35}
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
        )
      )}
    </>
  )
}

export default Board