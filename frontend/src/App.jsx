import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import AuthPage from './pages/auth/AuthPage'
import DiscoverPage from './pages/user/DiscoverPage'
import AlbumsPage from './pages/user/AlbumsPage'
import ArtistDashboard from './pages/artist/ArtistDashboard'
import UploadTrackPage from './pages/artist/UploadTrackPage'
import CreateAlbumPage from './pages/artist/CreateAlbumPage'
import MyTracksPage from './pages/artist/MyTracksPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function RootRedirect() {
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <Navigate to={user?.role === 'artist' ? '/artist/dashboard' : '/user/discover'} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* User (Listener) Routes */}
      <Route path="/user/discover" element={
        <ProtectedRoute role="user"><DiscoverPage /></ProtectedRoute>
      } />
      <Route path="/user/albums" element={
        <ProtectedRoute role="user"><AlbumsPage /></ProtectedRoute>
      } />

      {/* Artist Routes */}
      <Route path="/artist/dashboard" element={
        <ProtectedRoute role="artist"><ArtistDashboard /></ProtectedRoute>
      } />
      <Route path="/artist/upload" element={
        <ProtectedRoute role="artist"><UploadTrackPage /></ProtectedRoute>
      } />
      <Route path="/artist/album/create" element={
        <ProtectedRoute role="artist"><CreateAlbumPage /></ProtectedRoute>
      } />
      <Route path="/artist/my-tracks" element={
        <ProtectedRoute role="artist"><MyTracksPage /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
