import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/recommendations.css";
import axios from "axios";

function Recommendations({genreName, Token, artistName, songName}) {
 


   
const [genres, setGenres] = useState([]);

    useEffect(() => {
   
    const FetchAllGenres = async () => {
      try {
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/search?types=songs&term=${genreName[0]+genreName[1]}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        });
        if (response.status == 200) {
          setGenres(response.data.results.songs);
          
        }
      } catch (error) {
        console.log("here is the error for recommendations: " + error);
      }
    };

    if (true) {
    
      FetchAllGenres();
    }
  }, [artistName]);

  console.log(genres)



    return (
        <div>
            <h2>Because you like:</h2>
            <h4>{songName}</h4>
            {genres ? (genres.data?.map((song)=>(
            <p className="recommendedArtist" key={song.attributes.id}>{song.attributes.artistName}</p>))) : (<p>LOADING...</p>)
           (<p>LOADING</p>)}
        </div>
    );
}

export default Recommendations;