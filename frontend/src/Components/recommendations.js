import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/recommendations.css";
import axios from "axios";

function Recommendations({ genreName, Token, artistName, songName }) {
  const playMusicRef = useRef(null);

  const [songURL, setSongURL] = useState("");
  const [randomIndex, setRandomIndex] = useState([]);

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const FetchAllGenres = async () => {
      try {
        let searchTerm = genreName[2] ? genreName[2] || genreName[1] : genreName[0] ;
   //     console.log("Search term for recommendations: " + searchTerm);
       const response = await axios.get(
          `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=25&term=${searchTerm}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
          },
        );
       
          if(response.status === 200) {
          setGenres(response.data.results.songs);
        }
   }
      catch (error) {
        console.log("here is the error for recommendations: " + error);
      }
    };

    FetchAllGenres();
  }, [songName]);

  console.log(genres);


useEffect(() => {
  const max = 25;
    for (let i = 0; i < 5; i++) {
   const randomNumber = Math.floor(Math.random() * max);
   if (!randomIndex.includes(randomNumber)) {
     setRandomIndex((prevIndexes) => [...prevIndexes, randomNumber]);
   }else{i--;}
  }


}, [genreName]);

console.log(randomIndex);


  //const playingsong = `http://localhost:9000/api/${songId}`;
  const playSongPreview = async (songId) => {
    const musicToken = sessionStorage.getItem("music-user-token");
    const playingsong = `/api/${songId}`;
    try {
      const response = await axios.get(playingsong, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          "Music-User-Token": `${musicToken}`,
        },
      });
      if (response.status == 200) {
        const previewUrl = response.data.data.map((song) =>
          song.attributes.previews.map((preview) => preview.url),
        );
        // console.log("Preview URL:", previewUrl);
        setSongURL(previewUrl);
      }
    } catch (error) {
      console.log("Error playing song preview: " + error);
    }
  };

  const handlePlayClick = () => {
    playMusicRef.current.play();
  };

  const handlePauseClick = () => {
    playMusicRef.current.pause();
  };

  console.log(songURL);
  return (
    <div>
      <h3 style={{ marginLeft: "20px" }}>Because you like:</h3>
      <h4>{songName}</h4>
      {genres ? (
        genres.data.filter((song, index) => randomIndex.includes(index)).map((song) => (
          <p
            className="recommendedArtist"
            key={song.attributes.id}
            onMouseEnter={() => playSongPreview(song.attributes.playParams.id)}
            style={{ margin: "10px" }}
          >
            {song.attributes.artistName} - {song.attributes.name}
            <div>
              <button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  margin: "5px",
                }}
                onClick={handlePlayClick}
              >
                Play
              </button>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  margin: "5px",
                }}
                onClick={handlePauseClick}
              >
                Pause
              </button>
              {/* The audio element is hidden if controls are not included */}
            </div>
            <audio ref={playMusicRef} src={songURL} />
          </p>
        ))
      ) : (
        <p>LOADING</p>
      )}
    </div>
  );
}

export default Recommendations;
