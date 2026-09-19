function ScorePanel({ scores, onNewGame }) {
  return (
    <div className="score-panel">
      <div className="score-panel__scores">
        <div className="score-panel__item score-panel__item--x">
          <span className="score-panel__label">Player X</span>
          <span className="score-panel__value">{scores.X}</span>
        </div>
        <div className="score-panel__item score-panel__item--o">
          <span className="score-panel__label">Player O</span>
          <span className="score-panel__value">{scores.O}</span>
        </div>
      </div>
      <button className="score-panel__new-game" onClick={onNewGame}>
        New Game
      </button>
    </div>
  )
}

export default ScorePanel