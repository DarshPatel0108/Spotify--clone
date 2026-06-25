import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import musicReducer from './slices/musicSlice'
import playerReducer from './slices/playerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    music: musicReducer,
    player: playerReducer,
  },
})
