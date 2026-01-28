import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Recommendations({genreName, Token}) {
    console.log("in recommendations component, genreName: " + genreName);

   
const [genres, setGenres] = useState([]);

    useEffect(() => {
   
    const FetchAllGenres = async () => {
      try {
        const response = await axios.get(`https://api.music.apple.com/v1/catalog/us/search?types=songs,&term=${genreName}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        });
        if (response.status == 200) {
          console.log(response);
          setGenres(response.data.data);
        }
      } catch (error) {
        console.log("here is the error: " + error);
      }
    };

    if (true) {
    
      FetchAllGenres();
    }
  }, []);

 // console.log(genres.length);

 /*const songmatches = genreName.filter(song => genres.map(genre => genre.attributes.name).includes(song));
 const matchedGenresId = songmatches.map(name => {
    const genre = genres.find(genre => genre.attributes.name === name);
    return genre ? genre.id : null;
  }).filter(id => id !== null);

  console.log(matchedGenresId[0]);


    console.log(songmatches[0]); */

    return (
        <div>
            <h2>{genreName}</h2>
            <p>Welcome to the recommendations component</p>
            <h2>Recommendations</h2>
            <p>Welcome to the recommendations component</p>
            <h2>{genreName}</h2>
            <p>Welcome to the recommendations component</p>
            <h2>Recommendations</h2>
            <p>Welcome to the recommendations component</p>
        </div>
    );
}

export default Recommendations;