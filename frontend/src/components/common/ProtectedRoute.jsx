import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth)

  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (role && user?.role !== role) {
    // Redirect to correct home based on actual role
    return <Navigate to={user?.role === 'artist' ? '/artist/dashboard' : '/user/discover'} replace />
  }
  return children
}
