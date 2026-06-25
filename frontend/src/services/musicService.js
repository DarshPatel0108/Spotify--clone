import api from './api'

export const musicService = {
  // Artist: upload a track (multipart)
  async uploadTrack(formData) {
    const res = await api.post('/music/upload', formData)
    return res.data
  },

  // Artist: create an album
  async createAlbum(data) {
    const res = await api.post('/music/album', data)
    return res.data
  },

  // User/Artist: browse all tracks
  async getAllMusics() {
    const res = await api.get('/music/')
    return res.data
  },

  // User/Artist: browse all albums
  async getAllAlbums() {
    const res = await api.get('/music/albums')
    return res.data
  },

  // User/Artist: album detail with tracks
  async getAlbumById(albumId) {
    const res = await api.get(`/music/albums/${albumId}`)
    return res.data
  },

  // Artist: delete a track
  async deleteTrack(id) {
    const res = await api.delete(`/music/${id}`)
    return res.data
  },
}
