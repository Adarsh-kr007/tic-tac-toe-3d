function GameInfo({ isXTurn, winner, isTie, onRestart }) {
  let message
  if (winner) {
    message = `Player ${winner} wins!`
  } else if (isTie) {
    message = "It's a tie!"
  } else {
    message = `Player ${isXTurn ? 'X' : 'O'}'s turn`
  }

  return (
    <div className="game-info">
      <p className="game-info__message">{message}</p>
      <button className="game-info__button" onClick={onRestart}>
        Restart Game
      </button>
    </div>
  )
}

export default GameInfo