import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMusic } from "../../hooks/useMusic";
import { usePlayer } from "../../hooks/usePlayer";
import Sidebar from "../../components/layout/Sidebar";
import MusicPlayer from "../../components/player/MusicPlayer";

export default function MyTracksPage() {
  const { user } = useAuth();
  const { songs, loading, error, fetchSongs, deleteTrack } = useMusic();
  const { playAll, currentSong, isPlaying, toggle } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const mySongs = songs.filter(
    (s) => s.artist?._id === user?.id || s.artist === user?.id,
  );

  const handlePlay = (song, index) => {
    if (currentSong?._id === song._id) {
      toggle();
    } else {
      playAll(mySongs, index);
    }
  };

  const handleDelete = async (songId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this track?")) {
      await deleteTrack(songId);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="with-sidebar">
        <div className="page-header">
          <h2 className="page-title">My Tracks</h2>
          <p className="page-subtitle">
            {mySongs.length} track{mySongs.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>

        {error && <div className="sw-alert error">⚠ {error}</div>}

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button
            className="btn-accent"
            onClick={() => navigate("/artist/upload")}
          >
            ⬆️ Upload New Track
          </button>
          {mySongs.length > 0 && (
            <button className="btn-ghost" onClick={() => playAll(mySongs, 0)}>
              ▶ Play All
            </button>
          )}
        </div>

        {loading ? (
          <div className="spinner-wrap">
            <div className="sw-spinner" />
          </div>
        ) : mySongs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎼</div>
            <p>You haven't uploaded any tracks yet.</p>
            <button
              className="btn-accent"
              style={{ marginTop: 16 }}
              onClick={() => navigate("/artist/upload")}
            >
              Upload Your First Track
            </button>
          </div>
        ) : (
          <div className="music-grid">
            {mySongs.map((song, i) => {
              const isCurrentPlaying =
                currentSong?._id === song._id && isPlaying;
              return (
                <div
                  key={song._id || song.id || `${song.title}-${i}`}
                  className={`music-card ${currentSong?._id === song._id ? "playing" : ""}`}
                  onClick={() => handlePlay(song, i)}
                >
                  <div className="music-thumb">
                    {isCurrentPlaying ? (
                      <div
                        className="waveform"
                        style={{ transform: "scale(0.7)" }}
                      >
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      "🎵"
                    )}
                  </div>
                  <div className="music-info">
                    <div className="music-title">{song.title}</div>
                    <div className="music-artist">by you</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="play-btn-inline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(song, i);
                      }}
                    >
                      {isCurrentPlaying ? "⏸" : "▶"}
                    </button>
                    <button
                      className="play-btn-inline"
                      style={{ background: "#ef4444" }}
                      onClick={(e) => handleDelete(song._id || song.id, e)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <MusicPlayer />
    </div>
  );
}
