import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const userNav = [
  { to: '/user/discover', icon: '🎵', label: 'Discover' },
  { to: '/user/albums', icon: '💿', label: 'Albums' },
]

const artistNav = [
  { to: '/artist/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/artist/upload', icon: '⬆️', label: 'Upload Track' },
  { to: '/artist/album/create', icon: '🗂️', label: 'Create Album' },
  { to: '/artist/my-tracks', icon: '🎼', label: 'My Tracks' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === 'artist' ? artistNav : userNav

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Soundwave</h1>
        <span>Music Platform</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">
          {user?.role === 'artist' ? 'Artist Studio' : 'Listening'}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-badge">
          <div className="user-avatar">
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Log out">
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
