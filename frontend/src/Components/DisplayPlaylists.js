import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";




const ConnectToPlaylists = () => {
  const musicPlaylists = `https://api.music.apple.com/v1/me/library/playlists`; // Example MusicKit API endpoint
const [myPlaylists, setMyPlaylists] = useState([]);
   const documentRef = useRef(document);
    const button = documentRef.current.getElementById("image");
  const navigate = useNavigate();
let [searchParams, setSearchParams] = useSearchParams();
  


const DisplayPlaylists = () => {
    // Navigate to the '/playlists' route
    navigate("/playlists");
  };



  function getPlaylists() {
    const userToken = searchParams.get("music-user-token");
    const decodedToken = decodeURIComponent(userToken);
    console.log(decodedToken);
    const getToken = sessionStorage.getItem("devtoken");

    axios
      .get(musicPlaylists, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Music-User-Token": `${decodedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response; // Parse the response body as JSON
      })
      .then((data) => {
        setMyPlaylists(data);
        // Process the playlist data here
        console.log("myPlaylists:", myPlaylists);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
  }

  return (
 
  <button type=" button" onMouseOver={getPlaylists} playlistdata={myPlaylists} id="image"></button>
  


)
  
  
};

export default ConnectToPlaylists;
