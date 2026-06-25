import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentSong: null,
    queue: [],
    queueIndex: 0,
    isPlaying: false,
    volume: 0.8,
    progress: 0,
    duration: 0,
  },
  reducers: {
    playSong(state, action) {
      state.currentSong = action.payload
      state.isPlaying = true
      state.progress = 0
    },
    playQueue(state, action) {
      const { songs, startIndex = 0 } = action.payload
      state.queue = songs
      state.queueIndex = startIndex
      state.currentSong = songs[startIndex]
      state.isPlaying = true
      state.progress = 0
    },
    togglePlay(state) {
      state.isPlaying = !state.isPlaying
    },
    setPlaying(state, action) {
      state.isPlaying = action.payload
    },
    nextSong(state) {
      if (state.queue.length > 0) {
        const next = (state.queueIndex + 1) % state.queue.length
        state.queueIndex = next
        state.currentSong = state.queue[next]
        state.isPlaying = true
        state.progress = 0
      }
    },
    prevSong(state) {
      if (state.queue.length > 0) {
        const prev = (state.queueIndex - 1 + state.queue.length) % state.queue.length
        state.queueIndex = prev
        state.currentSong = state.queue[prev]
        state.isPlaying = true
        state.progress = 0
      }
    },
    setProgress(state, action) {
      state.progress = action.payload
    },
    setDuration(state, action) {
      state.duration = action.payload
    },
    setVolume(state, action) {
      state.volume = action.payload
    },
    stopPlayer(state) {
      state.isPlaying = false
      state.currentSong = null
      state.progress = 0
    },
  },
})

export const {
  playSong, playQueue, togglePlay, setPlaying,
  nextSong, prevSong, setProgress, setDuration,
  setVolume, stopPlayer,
} = playerSlice.actions
export default playerSlice.reducer
