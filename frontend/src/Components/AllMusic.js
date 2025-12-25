import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../src/styles/playlistpage.css";
import { useState } from "react";
import axios from "axios";
import "../../src/styles/Carousel.css"

const AllMusic = () => {
  const location = useLocation();
  const myMusicData = location.state.myMusicData;
const [index, setIndex] = useState(0);
const handleSelect = (selectedIndex) => {
    setIndex(index+1);
  };
  console.log(myMusicData);

  return (
    <div>
      <div className="CarouselContainer">
      <h1>Playlist: </h1>
      <div className="Carousel">
      <Carousel interval={null}>
        {myMusicData.data.map((song)=> 
        <Carousel.Item key={song.id} className="CarouselItem">
          <img
            className="d-block w-100"
            src="https://media.geeksforgeeks.org/wp-content/uploads/20210425122739/2-300x115.png"
            alt="Image One"
          />
          <div className="songsNames">
          <Carousel.Caption>
            
            <h3 >{song.attributes.artistName}</h3>
            <p >{song.attributes.name}</p>
           
          </Carousel.Caption>
          </div>
        </Carousel.Item>
)}
      </Carousel>
     </div>
    </div>
    </div>
  );
};

export default AllMusic;
