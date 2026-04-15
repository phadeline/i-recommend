import React, { useState } from "react";
import axios from "axios";

function AddToPlaylist({ songId, songName, Token }) {
  const [playlists, setPlaylists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    if (playlists.length > 0) {
      setShowDropdown((prev) => !prev);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.music.apple.com/v1/me/library/playlists",
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Music-User-Token": sessionStorage.getItem("music-user-token"),
            "Content-Type": "application/json",
          },
        }
      );

      setPlaylists(response.data?.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const addToPlaylist = async (playlistId) => {
    setShowDropdown(false);
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(
        `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
        {
          data: [
            {
              id: songId,
              type: "songs",
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Music-User-Token": sessionStorage.getItem("music-user-token"),
            "Content-Type": "application/json",
          },
        }
      );

      setStatus("success");
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      setStatus("error");
    } finally {
      setLoading(false);
      // Clear status message after 3 seconds
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Add to Playlist button */}
      <button
        onClick={fetchPlaylists}
        disabled={loading}
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: "6px",
          padding: "4px 12px",
          cursor: loading ? "not-allowed" : "pointer",
          backdropFilter: "blur(4px)",
          marginTop: "6px",
          width: "100%",
        }}
      >
        {loading ? "..." : "＋ Add to Playlist"}
      </button>

      {/* Status message */}
      {status === "success" && (
        <div
          style={{
            color: "rgba(100, 255, 100, 0.9)",
            fontSize: "11px",
            marginTop: "4px",
            textAlign: "center",
          }}
        >
          ✓ Added "{songName}"
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            color: "rgba(255, 100, 100, 0.9)",
            fontSize: "11px",
            marginTop: "4px",
            textAlign: "center",
          }}
        >
          ✗ Failed to add song
        </div>
      )}

      {/* Playlist dropdown */}
      {showDropdown && playlists.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            backgroundColor: "rgba(20, 20, 20, 0.95)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            maxHeight: "180px",
            overflowY: "auto",
            zIndex: 100,
            backdropFilter: "blur(10px)",
            marginBottom: "4px",
          }}
        >
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => addToPlaylist(playlist.id)}
              style={{
                padding: "8px 12px",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {playlist.attributes.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddToPlaylist;