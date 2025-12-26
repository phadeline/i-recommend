import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../src/styles/playlistpage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../src/styles/Carousel.css"

function AllMusic (){
  const location = useLocation();
  const myMusicData = location.state.myMusicData;
const [artistArt, setArtistArt] = useState();
const [id, setId] = useState(null)
const url = window.location.hash;
console.log(url)
const UrlName = decodeURIComponent(url);
console.log(UrlName);
const finalUrlName = UrlName.replace("#/", "")


  console.log(myMusicData);

  function getArtwork(event, artwork){
    event.preventDefault();
    const imgSrc = MusicKit.formatArtworkURL(artwork, 200, 200);
    setArtistArt(imgSrc);
    
  }

  return (
    <div>
      <div className="CarouselContainer">
      <h1 className="PlaylistTitle">Playlist: {finalUrlName}</h1>
      <div className="Carousel">
      <Carousel style={{backgroundColor: "black"}} interval={null}>
        {myMusicData.data.map((song)=> 
        <Carousel.Item key={song.id} className="CarouselItem">
          <div >
            <img style={{objectFit: "scale-down"}}
            className="d-block w-100"
            src={MusicKit.formatArtworkURL(song.attributes.artwork, 200, 200)}
            alt="Image One"
          /></div>
          
         
          <Carousel.Caption>
           <div className="songsNames">
            <h3 >{song.attributes.artistName}</h3>
            <p >{song.attributes.name}</p>
            </div>
          </Carousel.Caption>
         
        </Carousel.Item>
)}
      </Carousel>
     </div>
    </div>
    </div>
  );
};

export default AllMusic;
