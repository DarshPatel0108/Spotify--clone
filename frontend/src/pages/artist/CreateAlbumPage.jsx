import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../../hooks/useMusic'
import Sidebar from '../../components/layout/Sidebar'
import MusicPlayer from '../../components/player/MusicPlayer'

export default function CreateAlbumPage() {
  const { songs, fetchSongs, createAlbum, uploadLoading, uploadSuccess, error, clearUpload } = useMusic()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [selectedSongs, setSelectedSongs] = useState([])
  const [localErr, setLocalErr] = useState('')

  useEffect(() => {
    fetchSongs()
    return () => clearUpload()
  }, [])

  useEffect(() => {
    if (uploadSuccess) {
      setTimeout(() => {
        clearUpload()
        navigate('/artist/dashboard')
      }, 1500)
    }
  }, [uploadSuccess])

  const toggleSong = (id) => {
    setSelectedSongs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr('')
    if (!title.trim()) { setLocalErr('Album title is required'); return }
    await createAlbum({ title: title.trim(), musicIds: selectedSongs })
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="with-sidebar">
        <div className="page-header">
          <h2 className="page-title">Create Album</h2>
          <p className="page-subtitle">Group your tracks into an album</p>
        </div>

        <div className="sw-card" style={{ maxWidth: 560 }}>
          {uploadSuccess && (
            <div className="sw-alert success">✓ Album created! Redirecting…</div>
          )}
          {(localErr || error) && (
            <div className="sw-alert error">⚠ {localErr || error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="sw-form-group">
              <label className="sw-label">Album Title</label>
              <input
                className="sw-input"
                placeholder="Enter album title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="sw-form-group">
              <label className="sw-label">
                Add Tracks ({selectedSongs.length} selected)
              </label>
              {songs.length === 0 ? (
                <div className="sw-alert info">
                  No tracks uploaded yet.{' '}
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    onClick={() => navigate('/artist/upload')}
                  >
                    Upload a track first →
                  </button>
                </div>
              ) : (
                <div className="music-grid" style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                  {songs.map((song) => {
                    const selected = selectedSongs.includes(song._id)
                    return (
                      <div
                        key={song._id}
                        className={`music-card ${selected ? 'playing' : ''}`}
                        onClick={() => toggleSong(song._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="music-thumb" style={{ fontSize: 14 }}>🎵</div>
                        <div className="music-info">
                          <div className="music-title">{song.title}</div>
                          <div className="music-artist">
                            {song.artist?.username || 'Unknown'}
                          </div>
                        </div>
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                          background: selected ? 'var(--accent)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 12, flexShrink: 0, transition: 'all 0.15s'
                        }}>
                          {selected ? '✓' : ''}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                className="btn-accent"
                disabled={uploadLoading || uploadSuccess}
              >
                {uploadLoading ? 'Creating…' : '🗂️ Create Album'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate('/artist/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <MusicPlayer />
    </div>
  )
}
