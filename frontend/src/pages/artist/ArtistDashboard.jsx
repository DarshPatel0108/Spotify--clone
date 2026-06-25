import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useMusic } from '../../hooks/useMusic'
import { usePlayer } from '../../hooks/usePlayer'
import Sidebar from '../../components/layout/Sidebar'
import MusicPlayer from '../../components/player/MusicPlayer'

export default function ArtistDashboard() {
  const { user } = useAuth()
  const { songs, albums, loading, fetchSongs, fetchAlbums } = useMusic()
  const { playAll } = usePlayer()
  const navigate = useNavigate()

  useEffect(() => {
    fetchSongs()
    fetchAlbums()
  }, [])

  // Filter to only this artist's content
  const mySongs = songs.filter((s) => s.artist?._id === user?.id || s.artist === user?.id)
  const myAlbums = albums.filter((a) => a.artist?._id === user?.id || a.artist === user?.id)

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="with-sidebar">
        <div className="page-header">
          <h2 className="page-title">Welcome, {user?.username} 🎤</h2>
          <p className="page-subtitle">Your artist studio dashboard</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{loading ? '…' : mySongs.length}</div>
            <div className="stat-label">Tracks Uploaded</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{loading ? '…' : myAlbums.length}</div>
            <div className="stat-label">Albums Created</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{songs.length}</div>
            <div className="stat-label">Total Platform Tracks</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="sw-card" style={{ marginBottom: 32 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-accent" onClick={() => navigate('/artist/upload')}>
              ⬆️ Upload Track
            </button>
            <button className="btn-accent" onClick={() => navigate('/artist/album/create')}
              style={{ background: 'linear-gradient(135deg, #e040fb, #9d5cfc)' }}
            >
              🗂️ Create Album
            </button>
            <button className="btn-ghost" onClick={() => navigate('/artist/my-tracks')}>
              🎼 View My Tracks
            </button>
          </div>
        </div>

        {/* Recent Tracks */}
        <div className="section-header">
          <div className="section-title">My Recent Tracks</div>
        </div>
        {loading ? (
          <div className="spinner-wrap"><div className="sw-spinner" /></div>
        ) : mySongs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <p>You haven't uploaded any tracks yet.</p>
            <button className="btn-accent" style={{ marginTop: 16 }}
              onClick={() => navigate('/artist/upload')}>
              Upload Your First Track
            </button>
          </div>
        ) : (
          <div className="music-grid">
            {mySongs.slice(0, 5).map((song, i) => (
              <div key={song._id} className="music-card"
                onClick={() => playAll(mySongs, i)}
              >
                <div className="music-thumb">🎵</div>
                <div className="music-info">
                  <div className="music-title">{song.title}</div>
                  <div className="music-artist">by you</div>
                </div>
                <button className="play-btn-inline">▶</button>
              </div>
            ))}
          </div>
        )}
      </main>
      <MusicPlayer />
    </div>
  )
}
