import { createSlice } from '@reduxjs/toolkit'

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    songs: [],
    albums: [],
    currentAlbum: null,
    loading: false,
    error: null,
    uploadLoading: false,
    uploadSuccess: false,
  },
  reducers: {
    setLoading(state, action) { state.loading = action.payload },
    setUploadLoading(state, action) { state.uploadLoading = action.payload },
    setUploadSuccess(state, action) { state.uploadSuccess = action.payload },
    setSongs(state, action) {
      state.songs = action.payload
      state.loading = false
      state.error = null
    },
    setAlbums(state, action) {
      state.albums = action.payload
      state.loading = false
    },
    setCurrentAlbum(state, action) {
      state.currentAlbum = action.payload
      state.loading = false
    },
    addSong(state, action) {
      state.songs.unshift(action.payload)
      state.uploadLoading = false
      state.uploadSuccess = true
    },
    addAlbum(state, action) {
      state.albums.unshift(action.payload)
      state.uploadLoading = false
      state.uploadSuccess = true
    },
    setError(state, action) {
      state.error = action.payload
      state.loading = false
      state.uploadLoading = false
    },
    resetUpload(state) {
      state.uploadLoading = false
      state.uploadSuccess = false
    },
  },
})

export const {
  setLoading, setUploadLoading, setUploadSuccess,
  setSongs, setAlbums, setCurrentAlbum,
  addSong, addAlbum, setError, resetUpload,
} = musicSlice.actions
export default musicSlice.reducer
