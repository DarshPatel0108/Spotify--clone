import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../../hooks/useMusic'
import Sidebar from '../../components/layout/Sidebar'
import MusicPlayer from '../../components/player/MusicPlayer'

export default function UploadTrackPage() {
  const { uploadTrack, uploadLoading, uploadSuccess, error, clearUpload } = useMusic()
  const navigate = useNavigate()
  const fileInputRef = useRef()
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [localErr, setLocalErr] = useState('')

  useEffect(() => {
    return () => clearUpload()
  }, [])

  useEffect(() => {
    if (uploadSuccess) {
      setTimeout(() => {
        clearUpload()
        navigate('/artist/my-tracks')
      }, 1500)
    }
  }, [uploadSuccess])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('audio/')) {
      setLocalErr('Please select an audio file (mp3, wav, etc.)')
      return
    }
    setFile(f)
    setLocalErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr('')
    if (!title.trim()) { setLocalErr('Track title is required'); return }
    if (!file) { setLocalErr('Please select an audio file'); return }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('music', file)
    await uploadTrack(formData)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="with-sidebar">
        <div className="page-header">
          <h2 className="page-title">Upload Track</h2>
          <p className="page-subtitle">Share your music with the world</p>
        </div>

        <div className="sw-card" style={{ maxWidth: 520 }}>
          {uploadSuccess && (
            <div className="sw-alert success">✓ Track uploaded! Redirecting…</div>
          )}
          {(localErr || error) && (
            <div className="sw-alert error">⚠ {localErr || error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="sw-form-group">
              <label className="sw-label">Track Title</label>
              <input
                className="sw-input"
                placeholder="Enter track title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="sw-form-group">
              <label className="sw-label">Audio File</label>
              <label
                className="sw-file-input-wrap"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
                <div className="sw-file-icon">🎵</div>
                {file ? (
                  <div className="sw-file-text">
                    <strong>{file.name}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ) : (
                  <div className="sw-file-text">
                    <strong>Click to browse</strong> or drag and drop<br />
                    Supports MP3, WAV, OGG, FLAC
                  </div>
                )}
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                className="btn-accent"
                disabled={uploadLoading || uploadSuccess}
              >
                {uploadLoading ? 'Uploading…' : '⬆ Upload Track'}
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
