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
    const primaryGenre = genreName
      .map((genre) => genre.replace("R&B/Soul", "Soul"))[0];

    try {
      const url = `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=25&term=${encodeURIComponent(primaryGenre)}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      const songs = response.data?.results?.songs?.data || [];

      const storedIds = new Set(
        JSON.parse(sessionStorage.getItem("displayedSongIds") || `[]`)
      );
      const storedTitles = new Set(
        JSON.parse(sessionStorage.getItem("displayedSongTitles") || `[]`)
      );

      const filtered = [];
      const seenInResponse = new Set();
      const seenTitles = new Set(storedTitles);

      songs.forEach((song) => {
        const id = song.id;
        const name = song.attributes?.name?.toLowerCase();
        const isCurrentSong = name === songName?.toLowerCase();
        const alreadyDisplayed = storedIds.has(id);
        const duplicateInResponse = seenInResponse.has(id);
        const duplicateTitle = seenTitles.has(name);

        if (!isCurrentSong && !alreadyDisplayed && !duplicateInResponse && !duplicateTitle) {
          seenInResponse.add(id);
          seenTitles.add(name);
          filtered.push(song);
        }
      });

      // Compute indexes immediately after filtering, no separate useEffect
      const max = filtered.length;
      const count = Math.min(5, max);
      const indexes = new Set();

      while (indexes.size < count) {
        indexes.add(Math.floor(Math.random() * max));
      }

      const chosenIndexes = [...indexes];

      // Save displayed ids and titles to sessionStorage
      const updatedIds = new Set(storedIds);
      const updatedTitles = new Set(storedTitles);

      chosenIndexes.forEach((i) => {
        const song = filtered[i];
        if (song) {
          updatedIds.add(song.id);
          updatedTitles.add(song.attributes?.name?.toLowerCase());
        }
      });

      sessionStorage.setItem("displayedSongIds", JSON.stringify([...updatedIds]));
      sessionStorage.setItem("displayedSongTitles", JSON.stringify([...updatedTitles]));

      setFinalGenresArray(filtered);
      setRandomIndexes(chosenIndexes);
sessionStorage.removeItem("displayedSongIds");
sessionStorage.removeItem("displayedSongTitles");
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
      <h5>Genre: {genreName[0]}</h5>

      {finalGenresArray.length > 0 ? (
        randomIndexes.map((index) => {
          const item = finalGenresArray[index];
          if (!item) return null;

          const songId = item.id;
          const { artistName, name, artwork } = item.attributes;
          const artworkUrl = artwork?.url
            ? artwork.url.replace("{w}", "300").replace("{h}", "300")
            : null;

          return (
            <div
              className="recommendedArtist"
              key={songId}
              style={{
                margin: "10px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "300px",
                height: "300px",
                borderRadius: "12px",
                backgroundImage: artworkUrl ? `url(${artworkUrl})` : "none",
                backgroundColor: artworkUrl ? "transparent" : "#333",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                  borderRadius: "0 0 12px 12px",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "12px",
                  width: "100%",
                }}
              >
                <div style={{ color: "white", fontSize: "13px", fontWeight: "bold" }}>
                  {artistName}
                </div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", marginBottom: "8px" }}>
                  {name}
                </div>

                <div>
                  <button
                    style={{
                      backgroundColor: "rgba(31, 190, 7, 0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.5)",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      margin: "0 4px 0 0",
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                    }}
                    onClick={() => handlePlayClick(songId)}
                  >
                    ▶ Play
                  </button>

                  <button
                    style={{
                      backgroundColor: "rgba(249, 7, 7, 0.2)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.5)",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                    }}
                    onClick={() => handlePauseClick(songId)}
                  >
                    ⏸ Pause
                  </button>
                </div>
              </div>

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
