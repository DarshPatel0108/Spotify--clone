import React, { useEffect } from 'react'
import { useMusic } from '../../hooks/useMusic'
import { usePlayer } from '../../hooks/usePlayer'
import Sidebar from '../../components/layout/Sidebar'
import MusicPlayer from '../../components/player/MusicPlayer'

export default function DiscoverPage() {
  const { songs, loading, error, fetchSongs } = useMusic()
  const { play, playAll, currentSong, isPlaying, toggle } = usePlayer()

  useEffect(() => { fetchSongs() }, [])

  const handlePlay = (song, index) => {
    if (currentSong?._id === song._id) {
      toggle()
    } else {
      playAll(songs, index)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="with-sidebar">
        <div className="page-header">
          <h2 className="page-title">Discover Music</h2>
          <p className="page-subtitle">
            {songs.length} tracks available
            {songs.length > 0 && (
              <button
                className="btn-accent"
                style={{ marginLeft: 16, padding: '6px 14px', fontSize: 13 }}
                onClick={() => playAll(songs, 0)}
              >
                ▶ Play All
              </button>
            )}
          </p>
        </div>

        {error && <div className="sw-alert error">⚠ {error}</div>}

        {loading ? (
          <div className="spinner-wrap"><div className="sw-spinner" /></div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <p>No tracks uploaded yet. Check back later!</p>
          </div>
        ) : (
          <div className="music-grid">
            {songs.map((song, i) => {
              const isCurrentPlaying = currentSong?._id === song._id && isPlaying
              return (
                <div
                  key={song._id}
                  className={`music-card ${currentSong?._id === song._id ? 'playing' : ''}`}
                  onClick={() => handlePlay(song, i)}
                >
                  <div className="music-thumb">
                    {isCurrentPlaying ? (
                      <div className="waveform" style={{ transform: 'scale(0.7)' }}>
                        <span/><span/><span/><span/><span/>
                      </div>
                    ) : '🎵'}
                  </div>
                  <div className="music-info">
                    <div className="music-title">{song.title}</div>
                    <div className="music-artist">
                      {song.artist?.username || 'Unknown Artist'}
                    </div>
                  </div>
                  <button
                    className="play-btn-inline"
                    onClick={(e) => { e.stopPropagation(); handlePlay(song, i) }}
                  >
                    {isCurrentPlaying ? '⏸' : '▶'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <MusicPlayer />
    </div>
  )
}
