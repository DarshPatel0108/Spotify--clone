import React, { useEffect, useState } from 'react'
import { useMusic } from '../../hooks/useMusic'
import { usePlayer } from '../../hooks/usePlayer'
import Sidebar from '../../components/layout/Sidebar'
import MusicPlayer from '../../components/player/MusicPlayer'

export default function AlbumsPage() {
  const { albums, currentAlbum, loading, fetchAlbums, fetchAlbumById } = useMusic()
  const { playAll } = usePlayer()
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => { fetchAlbums() }, [])

  const openAlbum = (id) => {
    setSelectedId(id)
    fetchAlbumById(id)
  }

  const closeAlbum = () => {
    setSelectedId(null)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="with-sidebar">
        <div className="page-header">
          <h2 className="page-title">Albums</h2>
          <p className="page-subtitle">{albums.length} albums in the collection</p>
        </div>

        {loading && !selectedId ? (
          <div className="spinner-wrap"><div className="sw-spinner" /></div>
        ) : albums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💿</div>
            <p>No albums yet. Artists are still uploading!</p>
          </div>
        ) : (
          <div className="album-grid">
            {albums.map((album) => (
              <div key={album._id} className="album-card" onClick={() => openAlbum(album._id)}>
                <div className="album-cover">💿</div>
                <div className="album-body">
                  <div className="album-title">{album.title}</div>
                  <div className="album-meta">by {album.artist?.username || 'Unknown'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Album Detail Modal */}
        {selectedId && (
          <div className="sw-overlay" onClick={closeAlbum}>
            <div className="sw-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeAlbum}>✕</button>
              {loading ? (
                <div className="spinner-wrap"><div className="sw-spinner" /></div>
              ) : currentAlbum ? (
                <>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32
                    }}>💿</div>
                    <div>
                      <div className="sw-modal-title" style={{ marginBottom: 4 }}>{currentAlbum.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                        by {currentAlbum.artist?.username}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                        {currentAlbum.musics?.length || 0} tracks
                      </div>
                    </div>
                  </div>

                  {currentAlbum.musics?.length > 0 && (
                    <button
                      className="btn-accent"
                      style={{ marginBottom: 16, width: '100%', justifyContent: 'center' }}
                      onClick={() => { playAll(currentAlbum.musics, 0); closeAlbum() }}
                    >
                      ▶ Play Album
                    </button>
                  )}

                  <div className="music-grid">
                    {currentAlbum.musics?.length === 0 ? (
                      <div className="empty-state" style={{ padding: '20px' }}>
                        <p>No tracks in this album yet.</p>
                      </div>
                    ) : (
                      currentAlbum.musics?.map((song, i) => (
                        <div key={song._id} className="music-card"
                          onClick={() => playAll(currentAlbum.musics, i)}
                        >
                          <div className="music-thumb" style={{ width: 36, height: 36, fontSize: 14 }}>🎵</div>
                          <div className="music-info">
                            <div className="music-title">{song.title}</div>
                          </div>
                          <button className="play-btn-inline">▶</button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </main>
      <MusicPlayer />
    </div>
  )
}
