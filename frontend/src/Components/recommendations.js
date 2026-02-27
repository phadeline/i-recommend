import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/recommendations.css";
import axios from "axios";

function Recommendations({ genreName, Token, songName }) {
  const playMusicRef = useRef(null);

  const [songURL, setSongURL] = useState("");
  const [randomIndex, setRandomIndex] = useState([]);

  const [genres, setGenres] = useState([]);
  const [secondGenres, setSecondGenres] = useState([]);
  const [finalGenresArray, setFinalGenresArray] = useState([]);

  
  useEffect(() => {
    const FetchAllGenres = async () => {

       genreName = genreName.map((genre) => genre.replace("R&B/Soul", "Soul"));
       console.log("genreName:", genreName);
  try {
      const requestone = await axios.get(
          `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=25&term=${genreName[0]}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`
            },
          },
        );
      const requesttwo = await axios.get(
          `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=25&term=${genreName[0]}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`
            },
          },
        );

    
       
          const [responseone, responsetwo] = await Promise.all([requestone, requesttwo]);
          setGenres(...responseone.data.results.songs);
          setSecondGenres(...responsetwo.data.results.songs);
          console.log("Genres:", genres);
          console.log("Second Genres:", secondGenres);
       
   }
      catch (error) {
        console.log("here is the error for recommendations2: " + error);
      }
    };

    FetchAllGenres();
  }, [songName]);


useEffect(() => {
  const max = 50;
    for (let i = 0; i < 5; i++) {
   const randomNumber = Math.floor(Math.random() * max);
   if (!randomIndex.includes(randomNumber)) {
     setRandomIndex((prevIndexes) => [...prevIndexes, randomNumber]);
   }else{i--;}
  }


}, [genreName]);



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
      {
      secondGenres.length > 0 && genres.length > 0 ? (
        setFinalGenresArray(genres.concat(secondGenres))
      ) : (
        <p>LOADING</p>
      )}
      {
      finalGenresArray.length > 0 ? (
  randomIndex?.map((index) => {
    const item = finalGenresArray[index];
    if (!item) return null;

    return (
      
      <p
        className="recommendedArtist"
        key={item.attributes.id}
        onMouseEnter={() =>
          playSongPreview(item.attributes.playParams.id)
        }
        style={{ margin: "10px" }}
      >
        {item.attributes.artistName} - {item.attributes.name}

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
        </div>

        <audio ref={playMusicRef} src={songURL} />
      </p>
    );
  })
) : (
  <p>LOADING</p>
)}
    </div>
  );
}

export default Recommendations;
