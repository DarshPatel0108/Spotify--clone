import { useDispatch, useSelector } from 'react-redux'
import { authService } from '../services/authService'
import {
  setLoading, loginSuccess, logoutSuccess, setError, clearError,
} from '../store/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((s) => s.auth)

  const register = async (data) => {
    dispatch(setLoading(true))
    dispatch(clearError())
    try {
      const res = await authService.register(data)
      dispatch(loginSuccess(res.user))
      return { success: true }
    } catch (err) {
      dispatch(setError(err.message))
      return { success: false, error: err.message }
    }
  }

  const login = async (data) => {
    dispatch(setLoading(true))
    dispatch(clearError())
    try {
      const res = await authService.login(data)
      dispatch(loginSuccess(res.user))
      return { success: true }
    } catch (err) {
      dispatch(setError(err.message))
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (_) {}
    dispatch(logoutSuccess())
  }

  return { user, isAuthenticated, loading, error, register, login, logout }
}
