import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/recommendations.css";
import axios from "axios";

function Recommendations({ genreName, Token, songName }) {
  const audioRefs = useRef({});

  const [songURLs, setSongURLs] = useState({});
  const [randomIndexes, setRandomIndexes] = useState([]);
  const [finalGenresArray, setFinalGenresArray] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);


  // 1. Fetch songs by genre, exclude the current song
  useEffect(() => {
  if (!genreName || genreName.length === 0) return;

  const FetchAllGenres = async () => {
    const normalizedGenres = genreName.map((genre) =>
      genre.replace("R&B/Soul", "Soul")
    );

    const primaryGenre = normalizedGenres[0];
    const secondaryGenre = normalizedGenres[1];

    // Fetch primary genre first
    const fetchGenre = async (genre) => {
      const url = `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=25&term=${encodeURIComponent(genre)}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      return response.data?.results?.songs?.data || [];
    };

    try {
      // Always fetch primary genre
      let primarySongs = await fetchGenre(primaryGenre);

      // Filter out current song from primary results
      const seen = new Set();
      let filtered = primarySongs.filter((song) => {
        const id = song.id;
        const name = song.attributes?.name?.toLowerCase();
        const isDuplicate = seen.has(id);
        const isCurrentSong = name === songName?.toLowerCase();

        if (!isDuplicate && !isCurrentSong) {
          seen.add(id);
          return true;
        }
        return false;
      });

      // Only fetch secondary genre if primary didn't yield 5 unique songs
      if (filtered.length < 5 && secondaryGenre) {
        console.log(
          `Primary genre "${primaryGenre}" only returned ${filtered.length} songs. Fetching secondary genre "${secondaryGenre}"...`
        );

        const secondarySongs = await fetchGenre(secondaryGenre);

        // Add secondary songs, skipping anything already in the primary results
        secondarySongs.forEach((song) => {
          const id = song.id;
          const name = song.attributes?.name?.toLowerCase();
          const isDuplicate = seen.has(id);
          const isCurrentSong = name === songName?.toLowerCase();

          if (!isDuplicate && !isCurrentSong) {
            seen.add(id);
            filtered.push(song);
          }
        });
      }

      setFinalGenresArray(filtered);
    } catch (error) {
      console.error("Error fetching genre songs:", error);
    }
  };

  FetchAllGenres();
}, [songName, genreName, Token]);
  // 3. Pick random indexes AFTER songs are loaded
  useEffect(() => {
    if (finalGenresArray.length === 0) return;

    const max = finalGenresArray.length;
    const count = Math.min(5, max);
    const indexes = new Set();

    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * max));
    }

    setRandomIndexes([...indexes]);
  }, [finalGenresArray]);

  // 4. Fetch preview URL per song, cache by song id
  const fetchAndPlayPreview = async (songId) => {
    // Stop whatever is currently playing
    if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
      audioRefs.current[currentlyPlaying].pause();
      audioRefs.current[currentlyPlaying].currentTime = 0;
    }

    try {
      // Use cached URL if available
      let previewUrl = songURLs[songId];

      if (!previewUrl) {
        const response = await axios.get(
          `http://localhost:9000/api/${songId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
              "Music-User-Token": sessionStorage.getItem("music-user-token"),
            },
          }
        );

        if (response.status === 200) {
          previewUrl =
            response.data.data?.[0]?.attributes?.previews?.[0]?.url || null;

          if (previewUrl) {
            // 5. Cache the URL so we don't re-fetch on every hover
            setSongURLs((prev) => ({ ...prev, [songId]: previewUrl }));
          }
        }
      }

      if (previewUrl && audioRefs.current[songId]) {
        audioRefs.current[songId].src = previewUrl;
        audioRefs.current[songId].play();
        setCurrentlyPlaying(songId);
      }
    } catch (error) {
      console.error("Error fetching song preview:", error);
    }
  };

  const handlePlayClick = (songId) => {
    fetchAndPlayPreview(songId);
  };

  const handlePauseClick = (songId) => {
    if (audioRefs.current[songId]) {
      audioRefs.current[songId].pause();
      setCurrentlyPlaying(null);
    }
  };

  return (
    <div>
      <h3 style={{ marginLeft: "20px" }}>Because you like:</h3>
      <h4>{songName}</h4>

      {finalGenresArray.length > 0 ? (
        randomIndexes.map((index) => {
          const item = finalGenresArray[index];
          if (!item) return null;

          const songId = item.id;
          const { artistName, name, artwork } = item.attributes;

          return (
            <div
              className="recommendedArtist"
              key={songId}
              style={{ margin: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
            >
              {/* Artwork thumbnail */}
              {artwork?.url && (
                <img
                  src={artwork.url.replace("{w}", "100").replace("{h}", "100")}
                  alt={name}
                  style={{ width: 100, height: 100, borderRadius: 4 }}
                />
              )}

              <div>
                <strong>{artistName}</strong> — {name}

                <div>
                  <button
                    style={{ backgroundColor: "green", color: "white", margin: "5px" }}
                    onClick={() => handlePlayClick(songId)}
                  >
                    Play
                  </button>

                  <button
                    style={{ backgroundColor: "red", color: "white", margin: "5px" }}
                    onClick={() => handlePauseClick(songId)}
                  >
                    Pause
                  </button>
                </div>
              </div>

              {/* 6. Each song gets its own audio element via ref callback */}
              <audio
                ref={(el) => {
                  if (el) audioRefs.current[songId] = el;
                }}
              />
            </div>
          );
        })
      ) : (
        <p>LOADING...</p>
      )}
    </div>
  );
}

export default Recommendations;