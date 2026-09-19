import { Line } from '@react-three/drei'

function GridLine() {
  const lines = [
    [[-0.5, 0, -1.5], [-0.5, 0, 1.5]],
    [[0.5, 0, -1.5], [0.5, 0, 1.5]],
    [[-1.5, 0, -0.5], [1.5, 0, -0.5]],
    [[-1.5, 0, 0.5], [1.5, 0, 0.5]],
  ]

  return (
    <>
      {lines.map((points, i) => (
        <Line key={i} points={points} color="white" lineWidth={2} />
      ))}
    </>
  )
}

export default GridLine