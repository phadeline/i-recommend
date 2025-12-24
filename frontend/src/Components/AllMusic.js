import React from "react";
import Carousel from "react-bootstrap/Carousel";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../../src/styles/playlistpage.css";
import { useState } from "react";
import axios from "axios";

const AllMusic = () => {
  const location = useLocation();
  const myMusicData = location.state.myMusicData;
;
  console.log(myMusicData);

  return (
    <div>
      <h1>Playlist:</h1>
      
            <h3>{myMusicData.data[0].attributes.albumName}</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          
    </div>
  );
};

export default AllMusic;
