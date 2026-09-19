import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'

import GridLine from './components/GridLine'
import Board from './components/Board'
import GameInfo from './components/GameInfo'
import ScorePanel from './components/ScorePanel'
import CubeMesh from './components/CubeMesh'
import SphereMesh from './components/SphereMesh'

import { cellPositions } from './constants'
import './App.css'

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function calculateWinner(cells) {
  for (const line of winningLines) {
    const [a, b, c] = line

    if (
      cells[a] &&
      cells[a] === cells[b] &&
      cells[a] === cells[c]
    ) {
      return {
        winner: cells[a],
        line,
      }
    }
  }

  return null
}

function flipCoin() {
  return Math.random() < 0.5 ? 'X' : 'O'
}

/*
 * Small decorative board shown on the welcome page.
 * It is completely separate from the actual game board.
 */
function WelcomeBoardPreview() {
  const groupRef = useRef(null)
  const { viewport } = useThree()

  const previewCells = [
    'X', 'O', null,
    'O', 'X', null,
    null, null, 'X',
  ]

  const isMobile = viewport.width < 7
  const isTablet = viewport.width >= 7 && viewport.width < 11

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const targetRotationX = state.pointer.y * 0.16
    const targetRotationY = state.pointer.x * 0.24

    groupRef.current.rotation.x +=
      (targetRotationX - groupRef.current.rotation.x) *
      Math.min(delta * 4, 1)

    groupRef.current.rotation.y +=
      (targetRotationY - groupRef.current.rotation.y) *
      Math.min(delta * 4, 1)

    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.45) * 0.025
  })

  if (isMobile) {
    return null
  }

  const boardPosition = isTablet
    ? [3.8, -0.35, -1.2]
    : [4.6, -0.35, -1.2]

  const boardScale = isTablet ? 0.9 : 1.05

  return (
    <group
      ref={groupRef}
      position={boardPosition}
      scale={boardScale}
    >
      <GridLine />

      {previewCells.map((value, index) => {
        if (!value) return null

        const position = cellPositions[index]

        if (value === 'X') {
          return (
            <CubeMesh
              key={`preview-x-${index}`}
              position={position}
              winning={false}
            />
          )
        }

        return (
          <SphereMesh
            key={`preview-o-${index}`}
            position={position}
            winning={false}
          />
        )
      })}
    </group>
  )
}

function WelcomePage({ onPlay }) {
  return (
    <div className="welcome-page">
      <Canvas
        className="welcome-canvas"
        camera={{
          position: [0, 2, 7],
          fov: 50,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />

          <pointLight
            position={[6, 6, 5]}
            intensity={2}
            color="#8a2be2"
          />

          <pointLight
            position={[-6, 3, -5]}
            intensity={2}
            color="#00d4ff"
          />

          <Environment
            preset="night"
            background
            blur={0.4}
          />

          <Stars
            radius={100}
            depth={60}
            count={6000}
            factor={4}
            saturation={0}
            fade
            speed={0.6}
          />

          <WelcomeBoardPreview />

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.12}
          />
        </Suspense>
      </Canvas>

      <div className="welcome-overlay">
        <div className="welcome-content">
          <div className="welcome-badge">
            3D GAME
          </div>

          <h1>
            TIC-TAC-TOE
            <span>3D</span>
          </h1>

          <p className="welcome-subtitle">
            The classic game, reimagined in three dimensions.
          </p>

          <button
            className="play-button"
            onClick={onPlay}
          >
            PLAY NOW
          </button>

          <div className="welcome-features">
            <span>3D BOARD</span>
            <span>•</span>
            <span>LOCAL MULTIPLAYER</span>
            <span>•</span>
            <span>NO SIGN-UP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [cells, setCells] = useState(Array(9).fill(null))
  const [isXTurn, setIsXTurn] = useState(true)
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
  })
  const [tossAnnouncement, setTossAnnouncement] = useState(null)
  const [tossId, setTossId] = useState(0)

  const result = calculateWinner(cells)
  const winner = result ? result.winner : null

  const isTie =
    !winner &&
    cells.every((cell) => cell !== null)

  useEffect(() => {
    if (!tossAnnouncement) return

    const timer = setTimeout(() => {
      setTossAnnouncement(null)
    }, 2600)

    return () => clearTimeout(timer)
  }, [tossAnnouncement, tossId])

  function startGame() {
    const starter = flipCoin()

    setCells(Array(9).fill(null))
    setIsXTurn(starter === 'X')
    setTossAnnouncement(starter)
    setTossId((id) => id + 1)
    setGameStarted(true)
  }

  function handleCellClick(index) {
    if (cells[index] || winner || isTie) return

    const newCells = [...cells]

    newCells[index] = isXTurn ? 'X' : 'O'

    setCells(newCells)
    setIsXTurn(!isXTurn)

    const newResult = calculateWinner(newCells)

    if (newResult) {
      setScores((prev) => ({
        ...prev,
        [newResult.winner]:
          prev[newResult.winner] + 1,
      }))
    }
  }

  function doRestart() {
    setCells(Array(9).fill(null))

    const starter = flipCoin()

    setIsXTurn(starter === 'X')
    setTossAnnouncement(starter)
    setTossId((id) => id + 1)
  }

  function handleNewGame() {
    setScores({
      X: 0,
      O: 0,
    })

    doRestart()
  }

  if (!gameStarted) {
    return (
      <WelcomePage
        onPlay={startGame}
      />
    )
  }

  return (
    <>
      <Canvas
        shadows
        style={{
          width: '100vw',
          height: '100vh',
        }}
        camera={{
          position: [0, 5, 5],
          fov: 50,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />

          <pointLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
          />

          <pointLight
            position={[-8, 4, -6]}
            intensity={2}
            color="#8a2be2"
          />

          <pointLight
            position={[8, 3, -8]}
            intensity={2}
            color="#00d4ff"
          />

          <Environment
            preset="night"
            background
            blur={0.4}
          />

          <Stars
            radius={100}
            depth={60}
            count={6000}
            factor={4}
            saturation={0}
            fade
            speed={0.6}
          />

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={4}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.4}
            autoRotate
            autoRotateSpeed={0.15}
          />

          <GridLine />

          <Board
            cells={cells}
            onCellClick={handleCellClick}
            winnerLine={
              result ? result.line : null
            }
            isXTurn={isXTurn}
            gameOver={!!winner || isTie}
          />
        </Suspense>
      </Canvas>

      <div className="hud-panel">
        <ScorePanel
          scores={scores}
          onNewGame={handleNewGame}
        />

        <GameInfo
          isXTurn={isXTurn}
          winner={winner}
          isTie={isTie}
          onRestart={doRestart}
        />
      </div>

      {tossAnnouncement && (
        <div className="toss-banner">
          <div
            key={tossId}
            className={`coin ${
              tossAnnouncement === 'X'
                ? 'coin--flip-x'
                : 'coin--flip-o'
            }`}
          >
            <div className="coin__face coin__face--front">
              X
            </div>

            <div className="coin__face coin__face--back">
              O
            </div>
          </div>

          <p className="toss-banner__text">
            Player {tossAnnouncement} starts!
          </p>
        </div>
      )}
    </>
  )
}

export default App