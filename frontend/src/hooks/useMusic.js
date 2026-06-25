import { useDispatch, useSelector } from 'react-redux'
import { musicService } from '../services/musicService'
import {
  setLoading, setUploadLoading, setSongs, setAlbums,
  setCurrentAlbum, addSong, addAlbum, removeSong, setError, resetUpload,
} from '../store/slices/musicSlice'

export function useMusic() {
  const dispatch = useDispatch()
  const { songs, albums, currentAlbum, loading, error, uploadLoading, uploadSuccess } =
    useSelector((s) => s.music)

  const fetchSongs = async () => {
    dispatch(setLoading(true))
    try {
      const res = await musicService.getAllMusics()
      dispatch(setSongs(res.musics))
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const fetchAlbums = async () => {
    dispatch(setLoading(true))
    try {
      const res = await musicService.getAllAlbums()
      dispatch(setAlbums(res.albums))
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const fetchAlbumById = async (id) => {
    dispatch(setLoading(true))
    try {
      const res = await musicService.getAlbumById(id)
      dispatch(setCurrentAlbum(res.album))
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const uploadTrack = async (formData) => {
    dispatch(setUploadLoading(true))
    try {
      const res = await musicService.uploadTrack(formData)
      dispatch(addSong(res.music))
      return { success: true }
    } catch (err) {
      dispatch(setError(err.message))
      return { success: false, error: err.message }
    }
  }

  const createAlbum = async (data) => {
    dispatch(setUploadLoading(true))
    try {
      const res = await musicService.createAlbum(data)
      dispatch(addAlbum(res.album))
      return { success: true }
    } catch (err) {
      dispatch(setError(err.message))
      return { success: false, error: err.message }
    }
  }

  const deleteTrack = async (id) => {
    try {
      await musicService.deleteTrack(id)
      dispatch(removeSong(id))
      return { success: true }
    } catch (err) {
      dispatch(setError(err.message))
      return { success: false, error: err.message }
    }
  }

  const clearUpload = () => dispatch(resetUpload())

  return {
    songs, albums, currentAlbum, loading, error,
    uploadLoading, uploadSuccess,
    fetchSongs, fetchAlbums, fetchAlbumById,
    uploadTrack, createAlbum, deleteTrack, clearUpload,
  }
}
