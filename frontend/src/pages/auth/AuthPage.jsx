import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AuthPage() {
  const { login, register, loading, error, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')   // 'login' | 'register'
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [localErr, setLocalErr] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'artist' ? '/artist/dashboard' : '/user/discover', { replace: true })
    }
  }, [isAuthenticated, navigate, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setLocalErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr('')
    if (mode === 'register') {
      if (!form.username || !form.email || !form.password) {
        setLocalErr('All fields are required')
        return
      }
      await register({ ...form, role })
    } else {
      if (!form.email || !form.password) {
        setLocalErr('Email and password required')
        return
      }
      await login({ email: form.email, password: form.password })
    }
  }

  const displayError = localErr || error

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Soundwave</h1>
          <p>Your music universe</p>
        </div>

        <div className="auth-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Sign In
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Create Account
          </button>
        </div>

        {displayError && (
          <div className="sw-alert error">⚠ {displayError}</div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="sw-form-group">
                <label className="sw-label">I am a</label>
                <div className="role-select-group">
                  <div
                    className={`role-option ${role === 'user' ? 'selected' : ''}`}
                    onClick={() => setRole('user')}
                  >
                    <span className="role-icon">🎧</span>
                    <div className="role-label">Listener</div>
                  </div>
                  <div
                    className={`role-option ${role === 'artist' ? 'selected' : ''}`}
                    onClick={() => setRole('artist')}
                  >
                    <span className="role-icon">🎤</span>
                    <div className="role-label">Artist</div>
                  </div>
                </div>
              </div>

              <div className="sw-form-group">
                <label className="sw-label">Username</label>
                <input
                  className="sw-input"
                  name="username"
                  placeholder="your_username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </>
          )}

          <div className="sw-form-group">
            <label className="sw-label">Email</label>
            <input
              className="sw-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="sw-form-group">
            <label className="sw-label">Password</label>
            <input
              className="sw-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button className="btn-accent" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-link">
          {mode === 'login' ? (
            <>No account? <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('register')}>Sign up</button></>
          ) : (
            <>Already have an account? <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('login')}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  )
}
