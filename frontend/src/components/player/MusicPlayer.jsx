import React from 'react'
import { usePlayer } from '../../hooks/usePlayer'

export default function MusicPlayer() {
  const { currentSong, isPlaying, volume, progress, duration,
    toggle, next, prev, seek, changeVolume, formatTime } = usePlayer()

  if (!currentSong) return null

  const pct = duration ? (progress / duration) * 100 : 0

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seek(ratio * duration)
  }

  return (
    <div className="music-player">
      {/* Track info */}
      <div className="player-track">
        <div className="player-thumb">🎵</div>
        <div>
          <div className="player-title">{currentSong.title}</div>
          <div className="player-artist">
            {currentSong.artist?.username || currentSong.artist || 'Unknown Artist'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button className="ctrl-btn" onClick={prev} title="Previous">⏮</button>
          <button className="play-pause-btn" onClick={toggle}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={next} title="Next">⏭</button>
        </div>
        <div className="progress-bar-wrap">
          <span className="progress-time">{formatTime(progress)}</span>
          <div className="progress-track" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="player-volume">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          className="volume-slider"
          min="0" max="1" step="0.01"
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
        />
      </div>

      {isPlaying && (
        <div className="waveform" style={{ flexShrink: 0 }}>
          <span/><span/><span/><span/><span/>
        </div>
      )}
    </div>
  )
}
