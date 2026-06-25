import { createSlice } from '@reduxjs/toolkit'

const stored = localStorage.getItem('sw_user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored ? JSON.parse(stored) : null,
    isAuthenticated: !!stored,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload
    },
    loginSuccess(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
      state.loading = false
      localStorage.setItem('sw_user', JSON.stringify(action.payload))
    },
    logoutSuccess(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('sw_user')
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { setLoading, loginSuccess, logoutSuccess, setError, clearError } = authSlice.actions
export default authSlice.reducer
