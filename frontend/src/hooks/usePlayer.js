import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  playSong, playQueue, togglePlay, setPlaying,
  nextSong, prevSong, setProgress, setDuration, setVolume,
} from '../store/slices/playerSlice'

// Single shared audio element
const audio = new Audio()

export function usePlayer() {
  const dispatch = useDispatch()
  const { currentSong, isPlaying, volume, progress, duration, queue, queueIndex } =
    useSelector((s) => s.player)
  const syncRef = useRef(false)

  // Sync audio src when song changes
  useEffect(() => {
    if (currentSong?.uri) {
      audio.src = currentSong.uri
      audio.volume = volume
      audio.play().catch(() => {})
    }
  }, [currentSong])

  // Play / pause
  useEffect(() => {
    if (!currentSong) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSong])

  // Volume sync
  useEffect(() => { audio.volume = volume }, [volume])

  // Progress tracking
  useEffect(() => {
    const onTime = () => dispatch(setProgress(audio.currentTime))
    const onDur = () => dispatch(setDuration(audio.duration))
    const onEnd = () => dispatch(nextSong())

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDur)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDur)
      audio.removeEventListener('ended', onEnd)
    }
  }, [dispatch])

  const play = (song) => dispatch(playSong(song))
  const playAll = (songs, startIndex = 0) => dispatch(playQueue({ songs, startIndex }))
  const toggle = () => dispatch(togglePlay())
  const next = () => dispatch(nextSong())
  const prev = () => dispatch(prevSong())
  const seek = (time) => {
    audio.currentTime = time
    dispatch(setProgress(time))
  }
  const changeVolume = (v) => dispatch(setVolume(v))

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return {
    currentSong, isPlaying, volume, progress, duration,
    play, playAll, toggle, next, prev, seek, changeVolume, formatTime,
  }
}
